// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

/**
 * @title ArcSignalMarket
 * @notice Prediction market contract for Arc ecosystem events
 * @dev Uses USDC for bets and implements a constant product market maker model
 */
contract ArcSignalMarket is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    using EnumerableSet for EnumerableSet.UintSet;

    // ─── Types ────────────────────────────────────────────────────────────────

    enum MarketStatus {
        Active,
        Closed,
        Resolved
    }

    enum Side {
        Yes,
        No
    }

    struct Market {
        uint256 id;
        string question;
        uint256 deadline;
        uint256 totalYes;
        uint256 totalNo;
        MarketStatus status;
        bool outcome; // true = YES won, false = NO won
        uint256 createdAt;
    }

    struct Position {
        uint256 marketId;
        Side side;
        uint256 amount;
        uint256 timestamp;
    }

    // ─── State Variables ──────────────────────────────────────────────────────

    IERC20 public immutable usdc;
    uint256 public marketCounter;
    uint256 public constant FEE_BPS = 200; // 2% fee
    uint256 public constant MIN_BET_AMOUNT = 1 * 10**6; // 1 USDC (6 decimals)

    mapping(uint256 => Market) public markets;
    mapping(address => EnumerableSet.UintSet) private userMarkets;
    mapping(address => mapping(uint256 => Position)) public positions;
    mapping(address => mapping(uint256 => bool)) public hasClaimed;

    // ─── Events ───────────────────────────────────────────────────────────────

    event MarketCreated(
        uint256 indexed marketId,
        string question,
        uint256 deadline
    );

    event BetPlaced(
        address indexed user,
        uint256 indexed marketId,
        Side side,
        uint256 amount,
        uint256 potentialPayout
    );

    event MarketResolved(
        uint256 indexed marketId,
        bool outcome
    );

    event PayoutClaimed(
        address indexed user,
        uint256 indexed marketId,
        uint256 amount
    );

    // ─── Constructor ──────────────────────────────────────────────────────────

    constructor(address _usdc) Ownable(msg.sender) {
        require(_usdc != address(0), "Invalid USDC address");
        usdc = IERC20(_usdc);
    }

    // ─── Market Creation ──────────────────────────────────────────────────────

    /**
     * @notice Create a new prediction market
     * @param question The prediction question
     * @param deadline Unix timestamp when market closes
     */
    function createMarket(
        string memory question,
        uint256 deadline
    ) external onlyOwner returns (uint256) {
        require(bytes(question).length > 0, "Question cannot be empty");
        require(deadline > block.timestamp, "Deadline must be in the future");

        uint256 marketId = marketCounter++;
        markets[marketId] = Market({
            id: marketId,
            question: question,
            deadline: deadline,
            totalYes: 0,
            totalNo: 0,
            status: MarketStatus.Active,
            outcome: false,
            createdAt: block.timestamp
        });

        emit MarketCreated(marketId, question, deadline);
        return marketId;
    }

    // ─── Betting ──────────────────────────────────────────────────────────────

    /**
     * @notice Place a bet on a market
     * @param marketId The market ID
     * @param side YES (0) or NO (1)
     * @param amount Amount of USDC to bet (6 decimals)
     */
    function placeBet(
        uint256 marketId,
        Side side,
        uint256 amount
    ) external nonReentrant {
        Market storage market = markets[marketId];
        require(market.status == MarketStatus.Active, "Market not active");
        require(block.timestamp < market.deadline, "Market deadline passed");
        require(amount >= MIN_BET_AMOUNT, "Bet amount too low");

        // Transfer USDC from user
        usdc.safeTransferFrom(msg.sender, address(this), amount);

        // Calculate fee
        uint256 fee = (amount * FEE_BPS) / 10000;
        uint256 betAmount = amount - fee;

        // Update market totals
        if (side == Side.Yes) {
            market.totalYes += betAmount;
        } else {
            market.totalNo += betAmount;
        }

        // Update or create position
        Position storage position = positions[msg.sender][marketId];
        if (position.amount == 0) {
            // New position
            position.marketId = marketId;
            position.side = side;
            position.amount = betAmount;
            position.timestamp = block.timestamp;
            userMarkets[msg.sender].add(marketId);
        } else {
            // Existing position - can only add to same side
            require(position.side == side, "Cannot bet on opposite side");
            position.amount += betAmount;
        }

        uint256 potentialPayout = calculatePayout(marketId, side, betAmount);
        emit BetPlaced(msg.sender, marketId, side, betAmount, potentialPayout);
    }

    /**
     * @notice Calculate potential payout for a bet
     * @param marketId The market ID
     * @param side YES or NO
     * @param amount Bet amount
     * @return Potential payout amount
     */
    function calculatePayout(
        uint256 marketId,
        Side side,
        uint256 amount
    ) public view returns (uint256) {
        Market memory market = markets[marketId];
        require(market.status == MarketStatus.Active, "Market not active");

        uint256 winningPool = side == Side.Yes ? market.totalYes : market.totalNo;
        uint256 losingPool = side == Side.Yes ? market.totalNo : market.totalYes;

        if (winningPool == 0) {
            // First bet on this side
            return amount;
        }

        // Constant product market maker formula
        // payout = amount + (amount * losingPool) / (winningPool + amount)
        uint256 payout = amount + (amount * losingPool) / (winningPool + amount);
        return payout;
    }

    // ─── Market Resolution ────────────────────────────────────────────────────

    /**
     * @notice Resolve a market (only owner)
     * @param marketId The market ID
     * @param outcome true if YES won, false if NO won
     */
    function resolveMarket(
        uint256 marketId,
        bool outcome
    ) external onlyOwner {
        Market storage market = markets[marketId];
        require(market.status == MarketStatus.Active, "Market not active");
        require(block.timestamp >= market.deadline, "Market not yet closed");

        market.status = MarketStatus.Resolved;
        market.outcome = outcome;

        emit MarketResolved(marketId, outcome);
    }

    /**
     * @notice Close a market without resolution (emergency only)
     * @param marketId The market ID
     */
    function closeMarket(uint256 marketId) external onlyOwner {
        Market storage market = markets[marketId];
        require(market.status == MarketStatus.Active, "Market not active");
        market.status = MarketStatus.Closed;
    }

    // ─── Claiming ────────────────────────────────────────────────────────────

    /**
     * @notice Claim payout for a resolved market
     * @param marketId The market ID
     */
    function claimPayout(uint256 marketId) external nonReentrant {
        Market memory market = markets[marketId];
        require(market.status == MarketStatus.Resolved, "Market not resolved");
        require(!hasClaimed[msg.sender][marketId], "Already claimed");

        Position memory position = positions[msg.sender][marketId];
        require(position.amount > 0, "No position found");

        bool userWon = (position.side == Side.Yes && market.outcome) ||
                       (position.side == Side.No && !market.outcome);

        if (userWon) {
            uint256 payout = calculateFinalPayout(marketId, position);
            hasClaimed[msg.sender][marketId] = true;
            usdc.safeTransfer(msg.sender, payout);
            emit PayoutClaimed(msg.sender, marketId, payout);
        } else {
            // User lost, mark as claimed but no payout
            hasClaimed[msg.sender][marketId] = true;
        }
    }

    /**
     * @notice Calculate final payout for a winning position
     * @param marketId The market ID
     * @param position The user's position
     * @return Final payout amount
     */
    function calculateFinalPayout(
        uint256 marketId,
        Position memory position
    ) internal view returns (uint256) {
        Market memory market = markets[marketId];
        uint256 totalPool = market.totalYes + market.totalNo;
        
        if (totalPool == 0) return 0;

        // Proportional payout based on position size
        uint256 userPool = position.side == Side.Yes ? market.totalYes : market.totalNo;
        if (userPool == 0) return 0;

        // User gets proportional share of total pool
        uint256 payout = (position.amount * totalPool) / userPool;
        return payout;
    }

    // ─── View Functions ───────────────────────────────────────────────────────

    /**
     * @notice Get market details
     * @param marketId The market ID
     * @return Market struct
     */
    function getMarket(uint256 marketId) external view returns (Market memory) {
        return markets[marketId];
    }

    /**
     * @notice Get user's position in a market
     * @param user User address
     * @param marketId Market ID
     * @return Position struct
     */
    function getUserPosition(
        address user,
        uint256 marketId
    ) external view returns (Position memory) {
        return positions[user][marketId];
    }

    /**
     * @notice Get all market IDs a user has positions in
     * @param user User address
     * @return Array of market IDs
     */
    function getUserMarkets(address user) external view returns (uint256[] memory) {
        uint256 length = userMarkets[user].length();
        uint256[] memory marketIds = new uint256[](length);
        for (uint256 i = 0; i < length; i++) {
            marketIds[i] = userMarkets[user].at(i);
        }
        return marketIds;
    }

    /**
     * @notice Check if user can claim payout
     * @param user User address
     * @param marketId Market ID
     * @return true if user can claim
     */
    function canClaim(address user, uint256 marketId) external view returns (bool) {
        Market memory market = markets[marketId];
        if (market.status != MarketStatus.Resolved) return false;
        if (hasClaimed[user][marketId]) return false;

        Position memory position = positions[user][marketId];
        if (position.amount == 0) return false;

        bool userWon = (position.side == Side.Yes && market.outcome) ||
                       (position.side == Side.No && !market.outcome);
        return userWon;
    }

    // ─── Admin Functions ──────────────────────────────────────────────────────

    /**
     * @notice Withdraw collected fees (only owner)
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = usdc.balanceOf(address(this));
        // Calculate total locked in active markets
        uint256 locked = 0;
        for (uint256 i = 0; i < marketCounter; i++) {
            Market memory market = markets[i];
            if (market.status == MarketStatus.Active) {
                locked += market.totalYes + market.totalNo;
            }
        }
        uint256 available = balance > locked ? balance - locked : 0;
        if (available > 0) {
            usdc.safeTransfer(owner(), available);
        }
    }
}
