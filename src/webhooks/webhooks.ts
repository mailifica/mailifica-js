import * as crypto from 'crypto';
import { WebhookEvent } from './interfaces/webhook-events';

export interface VerifySignatureOptions {
  payload: string | Buffer;
  signature: string;
  secret: string;
}

export class Webhooks {
  /**
   * Valida a assinatura HMAC SHA-256 do webhook enviado pela Mailifica
   */
  verifySignature({ payload, signature, secret }: VerifySignatureOptions): boolean {
    if (!signature || !secret) return false;

    const bodyString = typeof payload === 'string' ? payload : payload.toString('utf-8');

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(bodyString)
      .digest('hex');

    try {
      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature),
      );
    } catch {
      return false;
    }
  }

  /**
   * Converte e valida o payload recebido para o tipo WebhookEvent
   */
  constructEvent<T = Record<string, unknown>>({
    payload,
    signature,
    secret,
  }: VerifySignatureOptions): WebhookEvent<T> {
    const isValid = this.verifySignature({ payload, signature, secret });
    if (!isValid) {
      throw new Error('Assinatura HMAC do webhook inválida.');
    }

    const json = typeof payload === 'string' ? JSON.parse(payload) : JSON.parse(payload.toString('utf-8'));
    return json as WebhookEvent<T>;
  }
}
