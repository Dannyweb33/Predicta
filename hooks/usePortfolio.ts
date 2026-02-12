import { useAccount } from 'wagmi';
import { useReadContracts } from 'wagmi';
import { formatUnits } from 'viem';
import { ARC_SIGNAL_MARKET_ABI, getContractAddresses, isContractConfigured } from '@/lib/contracts';
import { useMarketCount, useAllMarkets } from './useMarkets';
import { useUserPositions } from './useUserPositions';

export interface PortfolioStats {
  totalDeposited: number;
  currentValue: number;
  totalPnl: number;
  totalPnlPercent: number;
  winRate: number;
  activeBets: number;
  totalBets: number;
}

export function usePortfolio() {
  const { address } = useAccount();
  const { market } = getContractAddresses();
  const configured = isContractConfigured();
  const { count } = useMarketCount();
  const { markets } = useAllMarkets();
  const { positions } = useUserPositions();

  // Get all user positions across all markets
  const { data: allPositionsData, isLoading: positionsLoading } = useReadContracts({
    contracts: address && count > 0 && configured
      ? Array.from({ length: count }, (_, i) => ({
          address: market,
          abi: ARC_SIGNAL_MARKET_ABI,
          functionName: 'getUserPosition' as const,
          args: [address!, BigInt(i)],
        }))
      : [],
    query: {
      enabled: !!address && count > 0 && configured,
    },
  });

  // Process positions
  const allPositions: Array<{
    marketId: number;
    side: 'yes' | 'no';
    amount: number;
    market: typeof markets[0] | undefined;
  }> = [];

  if (allPositionsData && address) {
    allPositionsData.forEach((resultItem, index) => {
      // Handle both formats: {data: ...} or {result: ..., status: ...}
      const data = (resultItem as any).data || (resultItem as any).result;
      const error = (resultItem as any).error;
      
      if (data && !error) {
        const position = data as {
          marketId: bigint;
          side: 0 | 1;
          amount: bigint;
          timestamp: bigint;
        };

        if (position.amount > 0n) {
          const marketId = Number(position.marketId);
          const marketData = markets.find((m) => m.id === marketId);
          
          allPositions.push({
            marketId,
            side: position.side === 0 ? 'yes' : 'no',
            amount: Number(formatUnits(position.amount, 6)),
            market: marketData,
          });
        }
      }
    });
  }

  // Calculate stats
  const activePositions = allPositions.filter(
    (p) => p.market && p.market.status === 'active'
  );
  const resolvedPositions = allPositions.filter(
    (p) => p.market && p.market.status === 'resolved'
  );

  const totalDeposited = allPositions.reduce((sum, p) => sum + p.amount, 0);
  
  // Calculate current value (active positions potential payout + resolved positions actual payout)
  let currentValue = 0;
  
  // Add potential payouts for active positions
  activePositions.forEach((p) => {
    if (p.market) {
      const totalPool = p.market.totalYes + p.market.totalNo;
      const userPool = p.side === 'yes' ? p.market.totalYes : p.market.totalNo;
      if (userPool > 0 && totalPool > 0) {
        currentValue += (p.amount * totalPool) / userPool;
      } else {
        currentValue += p.amount;
      }
    }
  });

  // Add actual payouts for resolved positions (if user won)
  resolvedPositions.forEach((p) => {
    if (p.market && p.market.outcome !== undefined) {
      const userWon = (p.side === 'yes' && p.market.outcome) || (p.side === 'no' && !p.market.outcome);
      if (userWon) {
        // Calculate payout based on final pool
        const totalPool = p.market.totalYes + p.market.totalNo;
        const userPool = p.side === 'yes' ? p.market.totalYes : p.market.totalNo;
        if (userPool > 0 && totalPool > 0) {
          currentValue += (p.amount * totalPool) / userPool;
        } else {
          currentValue += p.amount;
        }
      }
      // If lost, don't add anything (already counted in totalDeposited)
    }
  });

  const totalPnl = currentValue - totalDeposited;
  const totalPnlPercent = totalDeposited > 0 ? (totalPnl / totalDeposited) * 100 : 0;

  const wonBets = resolvedPositions.filter((p) => {
    if (!p.market || p.market.outcome === undefined) return false;
    return (p.side === 'yes' && p.market.outcome) || (p.side === 'no' && !p.market.outcome);
  }).length;

  const lostBets = resolvedPositions.length - wonBets;
  const winRate = resolvedPositions.length > 0 ? (wonBets / resolvedPositions.length) * 100 : 0;

  const stats: PortfolioStats = {
    totalDeposited,
    currentValue,
    totalPnl,
    totalPnlPercent,
    winRate,
    activeBets: activePositions.length,
    totalBets: allPositions.length,
  };

  return {
    stats,
    activePositions: activePositions.map((p) => ({
      marketId: p.marketId,
      side: p.side,
      amount: p.amount,
      market: p.market!,
      potentialPayout: p.market
        ? (() => {
            const totalPool = p.market.totalYes + p.market.totalNo;
            const userPool = p.side === 'yes' ? p.market.totalYes : p.market.totalNo;
            if (userPool > 0 && totalPool > 0) {
              return (p.amount * totalPool) / userPool;
            }
            return p.amount;
          })()
        : p.amount,
    })),
    resolvedPositions: resolvedPositions.map((p) => ({
      marketId: p.marketId,
      side: p.side,
      amount: p.amount,
      market: p.market!,
      status: (() => {
        if (!p.market || p.market.outcome === undefined) return 'active';
        const userWon = (p.side === 'yes' && p.market.outcome) || (p.side === 'no' && !p.market.outcome);
        return userWon ? 'won' : 'lost';
      })(),
      resolvedPayout: (() => {
        if (!p.market || p.market.outcome === undefined) return undefined;
        const userWon = (p.side === 'yes' && p.market.outcome) || (p.side === 'no' && !p.market.outcome);
        if (!userWon) return 0;
        const totalPool = p.market.totalYes + p.market.totalNo;
        const userPool = p.side === 'yes' ? p.market.totalYes : p.market.totalNo;
        if (userPool > 0 && totalPool > 0) {
          return (p.amount * totalPool) / userPool;
        }
        return p.amount;
      })(),
    })),
    isLoading: positionsLoading,
  };
}
