#!/bin/bash

# Script para configurar Foundry e dependências

echo "🔧 Setting up Foundry..."

# Verificar se Foundry está instalado
if ! command -v forge &> /dev/null; then
    echo "❌ Foundry não está instalado. Instalando..."
    curl -L https://foundry.paradigm.xyz | bash
    foundryup
else
    echo "✅ Foundry já está instalado"
fi

# Instalar dependências do OpenZeppelin
if [ ! -d "lib/openzeppelin-contracts" ]; then
    echo "📦 Instalando OpenZeppelin Contracts..."
    forge install OpenZeppelin/openzeppelin-contracts --no-commit
else
    echo "✅ OpenZeppelin Contracts já instalado"
fi

# Verificar se remappings.txt existe
if [ ! -f "remappings.txt" ]; then
    echo "📝 Criando remappings.txt..."
    echo "@openzeppelin/contracts/=lib/openzeppelin-contracts/contracts/" > remappings.txt
    echo "forge-std/=lib/forge-std/src/" >> remappings.txt
fi

echo "✅ Setup completo!"
