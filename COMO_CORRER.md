# O que falta fazer e como pôr o projeto a correr

## O que te falta fazer

### 1. Configurar WalletConnect (obrigatório para conectar carteira)

1. Vai a https://cloud.walletconnect.com  
2. Cria conta ou faz login  
3. Cria um projeto (ex: "Predicta")  
4. Copia o **Project ID**  
5. No projeto, edita `.env.local` e coloca:
   ```env
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=o_id_que_copiaste
   ```

### 2. Contratos (só se quiser apostar a sério na testnet)

- **Só para ver a app a correr:** não precisas de fazer deploy. A app usa dados mock e mostra um aviso a dizer que os contratos não estão configurados.
- **Para apostar na Arc Testnet:** precisas de fazer deploy dos contratos, ter USDC (sUUSDC) para gas fees e apostas, e preencher os endereços no `.env.local` (ver README).

---

## Como pôr o projeto a correr

### Passo 1: Instalar dependências

No terminal, na pasta do projeto:

```bash
cd ~/predicta
pnpm install
```

### Passo 2: Ficheiro de ambiente

Se ainda não tiveres `.env.local`, cria a partir do exemplo:

```bash
cp .env.local.example .env.local
```

Edita `.env.local` e garante que tens pelo menos:

- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...` (obrigatório para "Connect Wallet" funcionar)
- O resto pode ficar em branco para só ver a UI com dados mock.

### Passo 3: Arrancar o servidor de desenvolvimento

```bash
pnpm dev
```

### Passo 4: Abrir no browser

Abre: **http://localhost:3000**

Deves ver a app ArcSignal. Consegues:
- Navegar nos mercados (dados mock)
- Clicar em "Connect Wallet" (precisa do WalletConnect Project ID)
- Ver Portfolio e Leaderboard

---

## Resumo rápido

| O que queres fazer | O que precisas |
|--------------------|----------------|
| Só ver a app a correr | `pnpm install` → configurar `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` em `.env.local` → `pnpm dev` |
| Conectar carteira | WalletConnect Project ID no `.env.local` |
| Apostar na testnet | Deploy dos contratos + USDC (sUUSDC) na Arc Testnet + endereços no `.env.local` |

---

## Comandos úteis

```bash
pnpm dev      # Desenvolvimento (http://localhost:3000)
pnpm build    # Build para produção
pnpm start    # Correr build de produção
```
