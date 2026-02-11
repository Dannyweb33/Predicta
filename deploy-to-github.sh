#!/bin/bash

# Script para fazer commit e push do projeto para o GitHub
# Execute: bash deploy-to-github.sh

set -e

echo "🚀 Preparando commit para GitHub..."

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script no diretório raiz do projeto (predicta/)"
    exit 1
fi

# Inicializar git se necessário
if [ ! -d ".git" ]; then
    echo "📦 Inicializando repositório git..."
    git init
    git branch -M main
fi

# Configurar remote
echo "🔗 Configurando remote do GitHub..."
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/Dannyweb33/Predicta.git

# Adicionar todos os arquivos (respeitando .gitignore)
echo "📝 Adicionando arquivos..."
git add .

# Verificar status
echo "📊 Status do repositório:"
git status --short | head -20

# Fazer commit
echo "💾 Fazendo commit..."
git commit -m "feat: ArcSignal - Prediction Markets on Arc Testnet

- Smart contracts Solidity (ArcSignalMarket, MockUSDC)
- Frontend Next.js com Rainbow Kit integration
- Hooks React para interação com contratos
- Componentes integrados com blockchain
- Sistema completo de prediction markets"

# Fazer push
echo "⬆️ Fazendo push para GitHub..."
git push -u origin main --force

echo "✅ Projeto enviado para GitHub com sucesso!"
echo "🔗 Repositório: https://github.com/Dannyweb33/Predicta"
