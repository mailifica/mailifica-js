import { HttpClient } from '../common/client';
import { MailificaResponse } from '../common/response';
import { renderReactEmail } from '../render';
import { CreateEmailOptions, CreateEmailResponse } from './interfaces/create-email';
import { GetEmailResponse } from './interfaces/get-email';

export class Emails {
  constructor(private readonly client: HttpClient) {}

  /**
   * Dispara um e-mail transacional
   */
  async send(payload: CreateEmailOptions): Promise<MailificaResponse<CreateEmailResponse>> {
    const to = Array.isArray(payload.to)
      ? (payload.to.length === 1 ? payload.to[0] : payload.to[0])
      : payload.to;
    const cc = payload.cc ? (Array.isArray(payload.cc) ? payload.cc : [payload.cc]) : undefined;
    const bcc = payload.bcc ? (Array.isArray(payload.bcc) ? payload.bcc : [payload.bcc]) : undefined;
    const replyTo = Array.isArray(payload.reply_to || payload.replyTo)
      ? (payload.reply_to || payload.replyTo)?.[0]
      : (payload.reply_to || payload.replyTo);

    let html = payload.html;

    if ('react' in payload && payload.react) {
      html = await renderReactEmail(payload.react);
    }

    const { react: _, replyTo: __, ...cleanPayload } = payload as any;

    return this.client.post<CreateEmailResponse>('/emails', {
      ...cleanPayload,
      to,
      cc,
      bcc,
      reply_to: replyTo,
      html,
    });
  }

  /**
   * Alias de conveniência idêntico a `send()`
   */
  async create(payload: CreateEmailOptions): Promise<MailificaResponse<CreateEmailResponse>> {
    return this.send(payload);
  }

  /**
   * Consulta os detalhes e status de entrega de um e-mail enviado
   */
  async get(id: string): Promise<MailificaResponse<GetEmailResponse>> {
    return this.client.get<GetEmailResponse>(`/emails/${id}`);
  }
}
