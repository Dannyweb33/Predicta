# Como fazer Deploy dos Contratos

## ⚠️ Importante

O Foundry **não lê** o arquivo `.env.local` automaticamente. Tens duas opções:

## Opção 1: Usar o Script Automático (Recomendado)

```bash
bash scripts/deploy.sh
```

Este script:
- Lê as variáveis do `.env.local`
- Exporta para o Foundry
- Faz o deploy automaticamente

## Opção 2: Exportar Manualmente

```bash
# Carregar variáveis do .env.local
export $(grep -v '^#' .env.local | xargs)

# Fazer deploy
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url $NEXT_PUBLIC_ARC_RPC_URL \
  --broadcast \
  --verify \
  -vvvv
```

## Opção 3: Criar arquivo .env (Alternativa)

Se preferires, podes criar um arquivo `.env` na raiz (já está no .gitignore):

```bash
# Copiar PRIVATE_KEY do .env.local para .env
echo "PRIVATE_KEY=$(grep PRIVATE_KEY .env.local | cut -d '=' -f2)" > .env
echo "NEXT_PUBLIC_ARC_RPC_URL=https://rpc.testnet.arc.network" >> .env

# Depois fazer deploy normalmente
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url $NEXT_PUBLIC_ARC_RPC_URL \
  --broadcast \
  --verify \
  -vvvv
```

## Checklist antes do Deploy

- [ ] PRIVATE_KEY configurada no `.env.local`
- [ ] USDC (sUUSDC) na Arc Testnet para gas fees e transações
- [ ] Contratos compilados (`forge build`)
- [ ] RPC URL configurada

## Após o Deploy

1. Copia os endereços dos contratos que aparecem no terminal
2. Adiciona no `.env.local`:
   ```env
   NEXT_PUBLIC_MARKET_CONTRACT_ADDRESS=0x...
   NEXT_PUBLIC_USDC_CONTRACT_ADDRESS=0x...
   ```
3. Reinicia o servidor (`pnpm dev`)
