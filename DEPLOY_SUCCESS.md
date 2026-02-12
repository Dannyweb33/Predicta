# ✅ Deploy Concluído com Sucesso!

## 📋 Endereços dos Contratos

- **MockUSDC**: `0xB0D0FcB319Af9A3583917dA65335E5Ef8e165685`
- **ArcSignalMarket**: `0x1fbeEbeaFF867B9304c4876bB784c5D25e5C1cF3`

## 🔗 Ver no ArcScan

- MockUSDC: https://testnet.arcscan.app/address/0xB0D0FcB319Af9A3583917dA65335E5Ef8e165685
- ArcSignalMarket: https://testnet.arcscan.app/address/0x1fbeEbeaFF867B9304c4876bB784c5D25e5C1cF3

## ✅ Próximos Passos

### 1. Endereços já adicionados ao .env.local ✅

Os endereços foram automaticamente adicionados ao `.env.local`.

### 2. Obter USDC de Teste

Para fazer apostas, precisas de USDC. Como estamos usando MockUSDC, podes mintar tokens:

**Via ArcScan:**
1. Vai ao contrato MockUSDC: https://testnet.arcscan.app/address/0xB0D0FcB319Af9A3583917dA65335E5Ef8e165685
2. Clica em "Write Contract"
3. Conecta a tua carteira
4. Chama a função `mint(address to, uint256 amount)`
   - `to`: Teu endereço de wallet
   - `amount`: `1000000000` (isso = 1000 USDC, pois USDC tem 6 decimais)

### 3. Criar Mercados

Para criar mercados de previsão:

**Via ArcScan:**
1. Vai ao contrato ArcSignalMarket: https://testnet.arcscan.app/address/0x1fbeEbeaFF867B9304c4876bB784c5D25e5C1cF3
2. Clica em "Write Contract"
3. Conecta a tua carteira (deve ser o owner - 0x530a0aD48E8203e1E400F0b1274dE7Dd6D34dA9C)
4. Chama `createMarket(string question, uint256 deadline)`
   - `question`: "Will ARC TVL exceed $100M by June 1, 2026?"
   - `deadline`: Timestamp Unix (ex: `1717200000` para 1 de junho de 2026)

### 4. Reiniciar o Frontend

Depois de adicionar os endereços, reinicia o servidor:

```bash
# Parar o servidor (Ctrl+C)
# Depois:
pnpm dev
```

Agora a app vai usar os contratos reais em vez de dados mock!

## 📝 Nota sobre Verificação

A verificação dos contratos falhou porque não há `ETHERSCAN_API_KEY` configurada. Isso é **opcional** - os contratos funcionam perfeitamente sem verificação. Se quiseres verificar:

1. Vai a https://testnet.arcscan.app
2. Regista-te e obtém uma API key
3. Adiciona ao `.env.local`:
   ```env
   ETHERSCAN_API_KEY=sua_api_key
   ```
4. Executa novamente o deploy (só vai verificar, não vai redeployar)

## 🎉 Tudo Pronto!

O projeto está completamente funcional e deployado na Arc Testnet!
