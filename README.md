# Predicta - Prediction Markets on Arc Testnet

Predicta é uma plataforma de mercados de previsão (prediction markets) construída para o ecossistema Arc, permitindo apostas em eventos do ecossistema usando USDC.

## 🚀 Funcionalidades

- **Mercados de Previsão**: Crie e participe de mercados sobre eventos do ecossistema Arc
- **Apostas com USDC**: Aposte usando USDC (6 decimais) em resultados YES/NO
- **Cálculo Automático de Odds**: Sistema de market maker com produto constante
- **Portfolio Tracking**: Acompanhe suas posições e histórico de apostas
- **Leaderboard**: Ranking dos melhores apostadores
- **Rainbow Kit Integration**: Conexão fácil com carteiras via Rainbow Kit

## 📋 Pré-requisitos

- Node.js 18+ e pnpm
- Foundry (para compilar e fazer deploy dos contratos)
- Carteira MetaMask ou compatível com WalletConnect
- USDC na Arc Testnet (pode usar MockUSDC para testes)

## 🛠️ Instalação

### 1. Instalar dependências do frontend

```bash
pnpm install
```

### 2. Instalar dependências do Foundry

```bash
# Instalar Foundry (se ainda não tiver)
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Instalar dependências do OpenZeppelin
forge install OpenZeppelin/openzeppelin-contracts
```

### 3. Configurar variáveis de ambiente

Copie o arquivo `.env.local.example` para `.env.local`:

```bash
cp .env.local.example .env.local
```

Edite `.env.local` e configure:

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

## 📝 Deploy dos Contratos

### 1. Compilar os contratos

```bash
forge build
```

### 2. Fazer deploy

Certifique-se de ter uma chave privada configurada em `.env.local`:

```env
PRIVATE_KEY=sua_chave_privada_aqui
```

Depois execute:

```bash
forge script script/Deploy.s.sol:DeployScript --rpc-url $NEXT_PUBLIC_ARC_RPC_URL --broadcast --verify -vvvv
```

Após o deploy, copie os endereços dos contratos para `.env.local`:

```env
NEXT_PUBLIC_MARKET_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_USDC_CONTRACT_ADDRESS=0x...
```

### 3. Obter USDC de teste

O contrato MockUSDC permite mintar tokens para qualquer endereço. Você pode usar uma função `mint` diretamente no contrato ou criar um script helper.

## 🏃 Executar o projeto

### Modo desenvolvimento

```bash
pnpm dev
```

Acesse [http://localhost:3000](http://localhost:3000)

### Build para produção

```bash
pnpm build
pnpm start
```

## 📚 Estrutura do Projeto

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

## 🔐 Segurança

- ✅ ReentrancyGuard para prevenir ataques de reentrância
- ✅ SafeERC20 para operações seguras com tokens
- ✅ Validações de entrada em todas as funções públicas
- ✅ Controle de acesso com Ownable
- ✅ Taxa de 2% para sustentabilidade do protocolo

## 📖 Como Usar

1. **Conectar Wallet**: Clique em "Connect Wallet" no header
2. **Navegar Mercados**: Veja os mercados ativos na página principal
3. **Fazer Aposta**: Clique em um mercado e escolha YES ou NO
4. **Aprovar USDC**: Na primeira vez, você precisará aprovar o contrato para gastar USDC
5. **Confirmar Aposta**: Confirme a transação na sua carteira
6. **Acompanhar Portfolio**: Veja suas posições na aba Portfolio

## 🧪 Testes

Para testar os contratos:

```bash
forge test
```

## 📝 Notas Importantes

- O projeto usa MockUSDC para testes. Em produção, substitua pelo contrato USDC real
- A rede configurada é Arc Testnet. Para mainnet, atualize as configurações
- Certifique-se de ter ETH na carteira para pagar gas fees
- Os mercados precisam ser resolvidos manualmente pelo owner do contrato

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 🔗 Links Úteis

- [Arc Network](https://arc.network)
- [Rainbow Kit](https://rainbowkit.com)
- [Wagmi](https://wagmi.sh)
- [Foundry](https://book.getfoundry.sh)
