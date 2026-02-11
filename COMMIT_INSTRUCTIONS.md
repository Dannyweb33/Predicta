# 📤 Instruções para Commit no GitHub

Devido a limitações de permissão no ambiente, execute os comandos manualmente:

## Opção 1: Usar o Script Automático

```bash
cd /home/karatekid/predicta
bash deploy-to-github.sh
```

## Opção 2: Comandos Manuais

```bash
cd /home/karatekid/predicta

# Inicializar git (se necessário)
git init
git branch -M main

# Configurar remote
git remote add origin https://github.com/Dannyweb33/Predicta.git
# ou se já existir:
git remote set-url origin https://github.com/Dannyweb33/Predicta.git

# Adicionar arquivos
git add .

# Fazer commit
git commit -m "feat: ArcSignal - Prediction Markets on Arc Testnet

- Smart contracts Solidity (ArcSignalMarket, MockUSDC)
- Frontend Next.js com Rainbow Kit integration
- Hooks React para interação com contratos
- Componentes integrados com blockchain
- Sistema completo de prediction markets"

# Fazer push
git push -u origin main --force
```

## Arquivos Removidos

Os seguintes arquivos .md foram removidos por serem desnecessários:
- ✅ FIXES.md (removido)
- ✅ DEPLOY.md (removido)
- ✅ NEXT_STEPS.md (removido)
- ✅ PRÓXIMOS_PASSOS.md (removido)

Apenas o **README.md** foi mantido com toda a documentação essencial.

## Verificação

Após o push, verifique em:
https://github.com/Dannyweb33/Predicta
