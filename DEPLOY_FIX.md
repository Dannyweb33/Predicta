# Correção do Deploy

## Problema

O Foundry precisa que a `PRIVATE_KEY` tenha o prefixo `0x` porque é uma string hexadecimal.

## Solução

### Opção 1: Adicionar 0x no .env.local (Recomendado)

No arquivo `.env.local`, certifique-se de que a PRIVATE_KEY começa com `0x`:

```env
PRIVATE_KEY=0xsua_chave_privada_aqui
```

**Importante:** Se a sua chave privada já começa com `0x`, não precisa fazer nada. Se não começa, adicione o `0x` no início.

### Opção 2: O script já corrige automaticamente

O script `scripts/deploy.sh` agora adiciona automaticamente o prefixo `0x` se não estiver presente.

## Como usar

```bash
bash scripts/deploy.sh
```

O script vai:
1. Carregar variáveis do `.env.local`
2. Adicionar `0x` à PRIVATE_KEY se necessário
3. Fazer o deploy automaticamente

## Exemplo

Se no `.env.local` tens:
```env
PRIVATE_KEY=abc123def456...
```

O script vai converter para:
```env
PRIVATE_KEY=0xabc123def456...
```

Antes de executar o Foundry.
