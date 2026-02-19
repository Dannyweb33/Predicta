# Predicta - Prediction Markets on Arc Testnet

Predicta is a prediction markets platform built for the Arc ecosystem, allowing bets on ecosystem events using USDC.

## 🚀 Features

- **Prediction Markets**: Create and participate in markets about Arc ecosystem events
- **USDC Betting**: Bet using USDC (6 decimals) on YES/NO outcomes
- **Automatic Odds Calculation**: Constant product market maker system
- **Portfolio Tracking**: Track your positions and betting history
- **Leaderboard**: Ranking of top bettors
- **Rainbow Kit Integration**: Easy wallet connection via Rainbow Kit

## 📋 Prerequisites

- Node.js 18+ and pnpm
- Foundry (to compile and deploy contracts)
- MetaMask wallet or compatible with WalletConnect
- USDC on Arc Testnet (can use MockUSDC for testing)

## 🛠️ Installation

### 1. Install frontend dependencies

```bash
pnpm install
```

### 2. Install Foundry dependencies

```bash
# Install Foundry (if you don't have it yet)
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Install OpenZeppelin dependencies
forge install OpenZeppelin/openzeppelin-contracts
```

### 3. Configure environment variables

Copy the `.env.local.example` file to `.env.local`:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and configure:

```env
# Arc Testnet Configuration
NEXT_PUBLIC_ARC_CHAIN_ID=5042002
NEXT_PUBLIC_ARC_RPC_URL=https://rpc.testnet.arc.network
NEXT_PUBLIC_ARC_EXPLORER_URL=https://testnet.arcscan.app

# Contract Addresses (preencher após deploy)
NEXT_PUBLIC_MARKET_CONTRACT_ADDRESS=
NEXT_PUBLIC_USDC_CONTRACT_ADDRESS=

# WalletConnect Project ID (obter em https://cloud.walletconnect.com)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
```

## 📝 Contract Deployment

### 1. Compile contracts

```bash
forge build
```

### 2. Deploy

Make sure you have a private key configured in `.env.local`:

```env
PRIVATE_KEY=your_private_key_here
```

Then run:

```bash
forge script script/Deploy.s.sol:DeployScript --rpc-url $NEXT_PUBLIC_ARC_RPC_URL --broadcast --verify -vvvv
```

After deployment, copy the contract addresses to `.env.local`:

```env
NEXT_PUBLIC_MARKET_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_USDC_CONTRACT_ADDRESS=0x...
```

### 3. Get test USDC

The MockUSDC contract allows minting tokens to any address. You can use a `mint` function directly on the contract or create a helper script.

## 🏃 Running the Project

### Development mode

```bash
pnpm dev
```

Access [http://localhost:3000](http://localhost:3000)

### Production build

```bash
pnpm build
pnpm start
```

## 📚 Project Structure

```
predicta/
├── app/                    # Next.js app directory
│   ├── layout.tsx          # Layout principal com providers
│   ├── page.tsx            # Página principal
│   └── providers.tsx       # Providers (Wagmi, RainbowKit, React Query)
├── components/             # Componentes React
│   ├── bet-dialog.tsx      # Dialog para fazer apostas
│   ├── header.tsx          # Header com conexão de wallet
│   ├── market-card.tsx    # Card de mercado
│   └── ...
├── contracts/              # Smart contracts Solidity
│   ├── ArcSignalMarket.sol # Contrato principal do mercado
│   └── MockUSDC.sol        # Mock USDC para testes
├── hooks/                  # React hooks customizados
│   └── useMarket.ts        # Hooks para interagir com contratos
├── lib/                    # Utilitários e configurações
│   ├── chains.ts           # Configuração da rede Arc
│   ├── contracts.ts        # ABIs e endereços dos contratos
│   ├── market-data.ts      # Tipos e dados mockados
│   └── wagmi.ts            # Configuração do Wagmi/RainbowKit
└── script/                 # Scripts de deploy
    └── Deploy.s.sol        # Script de deploy Foundry
```

## 🔐 Security

- ✅ ReentrancyGuard to prevent reentrancy attacks
- ✅ SafeERC20 for secure token operations
- ✅ Input validation on all public functions
- ✅ Access control with Ownable
- ✅ 2% fee for protocol sustainability

## 📖 How to Use

1. **Connect Wallet**: Click "Connect Wallet" in the header
2. **Browse Markets**: View active markets on the main page
3. **Place Bet**: Click on a market and choose YES or NO
4. **Approve USDC**: The first time, you'll need to approve the contract to spend USDC
5. **Confirm Bet**: Confirm the transaction in your wallet
6. **Track Portfolio**: View your positions in the Portfolio tab

## 🧪 Testing

To test the contracts:

```bash
forge test
```

## 📝 Important Notes

- The project uses MockUSDC for testing. In production, replace with the real USDC contract
- The configured network is Arc Testnet. For mainnet, update the configurations
- Make sure you have USDC (sUUSDC) in your wallet to pay gas fees and place bets
- Markets need to be resolved manually by the contract owner

## 🤝 Contributing

1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Useful Links

- [Arc Network](https://arc.network)
- [Rainbow Kit](https://rainbowkit.com)
- [Wagmi](https://wagmi.sh)
- [Foundry](https://book.getfoundry.sh)
