<p align="center">
  <a href="https://mailifica.com" target="_blank" rel="noopener noreferrer">
    <img src="https://raw.githubusercontent.com/mailifica/mailifica-js/main/.github/logo.png" alt="Mailifica Logo" width="120" height="120" onerror="this.style.display='none'"/>
  </a>
</p>

<h1 align="center">Mailifica Node.js & TypeScript SDK</h1>

<p align="center">
  <strong>The modern email infrastructure for developers. Send transactional emails, manage domains, batch sending, and verify webhooks in Node.js and TypeScript.</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@mailifica/mailifica-js"><img src="https://img.shields.io/npm/v/@mailifica/mailifica-js.svg?style=flat&color=10b981" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/@mailifica/mailifica-js"><img src="https://img.shields.io/npm/dm/@mailifica/mailifica-js.svg?style=flat&color=0ea5e9" alt="npm downloads" /></a>
  <a href="https://github.com/mailifica/mailifica-js"><img src="https://img.shields.io/github/stars/mailifica/mailifica-js?style=flat&color=f59e0b" alt="GitHub stars" /></a>
  <a href="https://github.com/mailifica/mailifica-js/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License" /></a>
  <a href="https://mailifica.com/docs"><img src="https://img.shields.io/badge/docs-mailifica.com-6366f1.svg" alt="Documentation" /></a>
</p>

---

## 📦 Installation

Install the official package from npm:

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

## 🚀 Quickstart

### 1. Initialize the Client

Set your API Key via constructor or provide the `MAILIFICA_API_KEY` environment variable:

```typescript
import { Mailifica } from '@mailifica/mailifica-js';

const mailifica = new Mailifica('ma_live_123456789abcdef');

// Or automatically load from process.env.MAILIFICA_API_KEY:
// const mailifica = new Mailifica();
```

---

### 2. Send an Email (HTML / Text)

```typescript
import { Mailifica } from '@mailifica/mailifica-js';

const mailifica = new Mailifica(process.env.MAILIFICA_API_KEY);

async function main() {
  const { data, error } = await mailifica.emails.send({
    from: 'onboarding@seudominio.com',
    to: 'cliente@gmail.com',
    subject: 'Boas-vindas ao Mailifica!',
    html: '<strong>Olá!</strong> Seu e-mail transacional foi entregue com sucesso.',
    tags: [
      { name: 'category', value: 'welcome' }
    ],
  });

  if (error) {
    console.error('Falha ao enviar e-mail:', error.message);
    return;
  }

  console.log('E-mail enviado! ID:', data.id);
}

main();
```

---

### 3. Send with React Email (`react: <Component />`)

Mailifica has built-in support for **React Email** components:

```tsx
import * as React from 'react';
import { Mailifica } from '@mailifica/mailifica-js';

const mailifica = new Mailifica();

interface EmailProps {
  name: string;
}

const WelcomeEmail = ({ name }: EmailProps) => (
  <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
    <h1 style={{ color: '#10b981' }}>Olá, {name}!</h1>
    <p>Obrigado por se registrar na nossa plataforma.</p>
  </div>
);

async function sendReactEmail() {
  const { data, error } = await mailifica.emails.send({
    from: 'equipe@seudominio.com',
    to: 'usuario@exemplo.com',
    subject: 'Sua conta foi criada!',
    react: <WelcomeEmail name="Tarcísio" />,
  });

  if (error) {
    return console.error(error);
  }

  console.log('React Email enviado com sucesso:', data.id);
}
```

---

### 4. Send Emails in Batch (Up to 50 recipients)

```typescript
const { data, error } = await mailifica.batch.send([
  {
    from: 'newsletter@seudominio.com',
    to: 'cliente1@exemplo.com',
    subject: 'Atualização de Sistema #1',
    html: '<p>Novos recursos disponíveis na sua conta.</p>',
  },
  {
    from: 'newsletter@seudominio.com',
    to: 'cliente2@exemplo.com',
    subject: 'Atualização de Sistema #2',
    html: '<p>Novos recursos disponíveis na sua conta.</p>',
  },
]);

if (data) {
  console.log(`Enviados ${data.data.length} e-mails.`);
}
```

---

### 5. Domain Management & DNS Verification

```typescript
// 1. Criar novo domínio
const { data: domain } = await mailifica.domains.create({
  name: 'email.minhaempresa.com',
});

// 2. Listar todos os domínios da organização
const { data: domainList } = await mailifica.domains.list();

// 3. Obter detalhes e registros DNS (SPF, DKIM, DMARC, MX)
const { data: details } = await mailifica.domains.get(domain.id);
console.log('Registros DNS necessários:', details.records);

// 4. Verificar propagação DNS
const { data: verified } = await mailifica.domains.verify(domain.id);
console.log('Status de verificação:', verified.status);
```

---

### 6. Webhooks HMAC Signature Verification

Verify incoming webhooks securely in your Express / Next.js / Fastify handlers:

```typescript
import { Webhooks } from '@mailifica/mailifica-js';

const webhooks = new Webhooks();

// In your Express or Next.js Route Handler:
export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get('mailifica-signature') || '';
  const webhookSecret = process.env.MAILIFICA_WEBHOOK_SECRET!;

  const isValid = webhooks.verifySignature({
    payload: rawBody,
    signature: signature,
    secret: webhookSecret,
  });

  if (!isValid) {
    return new Response('Assinatura de Webhook Inválida', { status: 401 });
  }

  const event = webhooks.constructEvent({
    payload: rawBody,
    signature: signature,
    secret: webhookSecret,
  });

  console.log('Evento recebido:', event.type, event.data);
  return new Response('OK', { status: 200 });
}
```

---

## 🛠️ Error Handling

Every SDK method returns a standardized `{ data, error }` object (matching Resend conventions):

```typescript
const { data, error } = await mailifica.emails.send({
  from: 'invalido@dominio.com',
  to: 'destinatario@exemplo.com',
  subject: 'Teste',
  html: '<p>Teste</p>',
});

if (error) {
  console.error('Nome do erro:', error.name);
  console.error('Mensagem:', error.message);
  console.error('Status HTTP:', error.statusCode);
} else {
  console.log('ID do envio:', data.id);
}
```

---

## 📚 Official Links & Documentation

- **Website Oficial:** [https://mailifica.com](https://mailifica.com)
- **Documentação da API:** [https://mailifica.com/docs](https://mailifica.com/docs)
- **Repositório GitHub:** [https://github.com/mailifica/mailifica-js](https://github.com/mailifica/mailifica-js)
- **Reportar Problemas:** [https://github.com/mailifica/mailifica-js/issues](https://github.com/mailifica/mailifica-js/issues)

---

## 📄 License

Distribuído sob a licença [MIT](https://github.com/mailifica/mailifica-js/blob/main/LICENSE).  
Copyright © 2026 Mailifica Inc.
