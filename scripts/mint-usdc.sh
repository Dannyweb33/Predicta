#!/bin/bash

# Script helper para mintar USDC de teste
# Uso: ./scripts/mint-usdc.sh <endereco_wallet> <quantidade>

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Uso: ./scripts/mint-usdc.sh <endereco_wallet> <quantidade>"
    echo "Exemplo: ./scripts/mint-usdc.sh 0x1234... 1000"
    exit 1
fi

WALLET=$1
AMOUNT=$2

# Converter para formato com 6 decimais (USDC)
AMOUNT_WEI=$(echo "$AMOUNT * 1000000" | bc)

echo "Mintando $AMOUNT USDC para $WALLET..."

# Usar cast para chamar a função mint
cast send "$USDC_ADDRESS" "mint(address,uint256)" "$WALLET" "$AMOUNT_WEI" \
    --rpc-url "$NEXT_PUBLIC_ARC_RPC_URL" \
    --private-key "$PRIVATE_KEY"

echo "✅ USDC mintado com sucesso!"
