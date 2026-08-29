import { HttpClient } from '../common/client';
import { MailificaResponse } from '../common/response';
import { CreateEmailOptions, CreateEmailResponse } from '../emails/interfaces/create-email';
import { renderReactEmail } from '../render';

export interface BatchSendResponse {
  data: CreateEmailResponse[];
}

export class Batch {
  constructor(private readonly client: HttpClient) {}

  /**
   * Envia até 50 e-mails numa única requisição de lote (Batch)
   */
  async send(emails: CreateEmailOptions[]): Promise<MailificaResponse<BatchSendResponse>> {
    const processed = await Promise.all(
      emails.map(async (email) => {
        const to = Array.isArray(email.to) ? email.to : [email.to];
        const cc = email.cc ? (Array.isArray(email.cc) ? email.cc : [email.cc]) : undefined;
        const bcc = email.bcc ? (Array.isArray(email.bcc) ? email.bcc : [email.bcc]) : undefined;
        const replyTo = email.reply_to || email.replyTo;

        let html = email.html;
        if ('react' in email && email.react) {
          html = await renderReactEmail(email.react);
        }

        const { react: _, ...rest } = email as any;
        return {
          ...rest,
          to,
          cc,
          bcc,
          reply_to: replyTo,
          html,
        };
      }),
    );

    return this.client.post<BatchSendResponse>('/emails/batch', processed);
  }

  async create(emails: CreateEmailOptions[]): Promise<MailificaResponse<BatchSendResponse>> {
    return this.send(emails);
  }
}
