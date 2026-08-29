# Mailifica Node.js & TypeScript SDK (`@mailifica/mailifica-js`)

> SDK oficial em **TypeScript nativo com 100% de tipagem estrita**, suporte a **React Email** (`react: <EmailTemplate />`), CommonJS, ESM e drop-in replacement para o pacote `resend`.

---

## 📦 Instalação

```bash
# npm
npm install @mailifica/mailifica-js

# pnpm
pnpm add @mailifica/mailifica-js

# yarn
yarn add @mailifica/mailifica-js

# bun
bun add @mailifica/mailifica-js
```

---

## 🚀 Como Usar

### 1. Inicialização

```typescript
import { Mailifica } from '@mailifica/mailifica-js';
// ou: import { mailifica } from '@mailifica/mailifica-js';

const client = new Mailifica('ma_sua_chave_aqui');
// ou configure a variável de ambiente MAILIFICA_API_KEY
// const client = new Mailifica();
```

### 2. Enviar um E-mail (HTML)

```typescript
const { data, error } = await client.emails.send({
  from: 'onboarding@suaempresa.ao',
  to: 'destinatario@empresa.com',
  subject: 'Bem-vindo ao Mailifica!',
  html: '<strong>Olá!</strong> Seu e-mail transacional foi entregue.',
});

if (error) {
  console.error('Erro ao enviar:', error);
  return;
}

console.log('E-mail enviado, ID:', data.id);
```

### 3. Enviar com React Email (`react: <Component />`)

```tsx
import { Mailifica } from 'mailifica-js';
import * as React from 'react';

const client = new Mailifica();

const WelcomeTemplate = ({ name }: { name: string }) => (
  <div>
    <h1>Bem-vindo, {name}!</h1>
    <p>Obrigado por criar sua conta.</p>
  </div>
);

const { data, error } = await client.emails.send({
  from: 'equipe@suaempresa.ao',
  to: 'cliente@gmail.com',
  subject: 'Boas-vindas',
  react: <WelcomeTemplate name="Tarcísio" />,
});
```

### 4. Envio em Lote (Batch)

```typescript
const { data, error } = await client.batch.send([
  {
    from: 'newsletter@suaempresa.ao',
    to: 'usuario1@empresa.com',
    subject: 'Novidade #1',
    html: '<p>Conteúdo 1</p>',
  },
  {
    from: 'newsletter@suaempresa.ao',
    to: 'usuario2@empresa.com',
    subject: 'Novidade #2',
    html: '<p>Conteúdo 2</p>',
  },
]);
```

### 5. Gestão de Domínios

```typescript
// Criar domínio
const { data: newDomain } = await client.domains.create({ name: 'meudominio.ao' });

// Listar domínios
const { data: domains } = await client.domains.list();

// Verificar DNS
const { data: verified } = await client.domains.verify(newDomain.id);
```

### 6. Verificação de Webhooks HMAC

```typescript
import { Webhooks } from 'mailifica-js';

const webhooks = new Webhooks();

const isValid = webhooks.verifySignature({
  payload: rawBodyString,
  signature: req.headers['mailifica-signature'],
  secret: process.env.MAILIFICA_WEBHOOK_SECRET!,
});
```

---

## 📄 Licença

MIT © [Mailifica](https://mailifica.com)
