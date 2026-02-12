#!/bin/bash

# Script para fazer deploy dos contratos
# Lê variáveis do .env.local e exporta para o Foundry

set -e

echo "🚀 Preparando deploy dos contratos..."

# Carregar variáveis do .env.local
if [ -f .env.local ]; then
    export $(grep -v '^#' .env.local | xargs)
    echo "✅ Variáveis carregadas do .env.local"
else
    echo "❌ Arquivo .env.local não encontrado!"
    exit 1
fi

# Verificar se PRIVATE_KEY está configurada
if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ PRIVATE_KEY não está configurada no .env.local"
    echo "💡 Adicione: PRIVATE_KEY=sua_chave_privada"
    exit 1
fi

# Garantir que PRIVATE_KEY tem prefixo 0x se não tiver
if [[ ! "$PRIVATE_KEY" =~ ^0x ]]; then
    export PRIVATE_KEY="0x$PRIVATE_KEY"
    echo "✅ Prefixo 0x adicionado à PRIVATE_KEY"
fi

# Verificar se RPC URL está configurada
RPC_URL="${NEXT_PUBLIC_ARC_RPC_URL:-https://rpc.testnet.arc.network}"
echo "📡 RPC URL: $RPC_URL"

# Fazer deploy
echo "📦 Fazendo deploy..."
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url "$RPC_URL" \
  --broadcast \
  --verify \
  -vvvv

echo "✅ Deploy concluído!"
echo "📝 Não esqueça de copiar os endereços dos contratos para .env.local"
