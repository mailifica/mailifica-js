import type { ReactElement } from 'react';
import type { Attachment, Headers, Tag } from '../../common/interfaces';

export interface CreateEmailBaseOptions {
  /**
   * Endereço do remetente (Ex: "Empresa <contato@suaempresa.ao>")
   */
  from: string;
  /**
   * Destinatário ou lista de destinatários
   */
  to: string | string[];
  /**
   * Assunto do e-mail
   */
  subject: string;
  /**
   * Conteúdo em HTML
   */
  html?: string;
  /**
   * Template em React / JSX (React Email)
   */
  react?: ReactElement;
  /**
   * Conteúdo em texto puro (Fallback para clientes sem HTML)
   */
  text?: string;
  /**
   * Destinatários em cópia (CC)
   */
  cc?: string | string[];
  /**
   * Destinatários em cópia oculta (BCC)
   */
  bcc?: string | string[];
  /**
   * Endereço para onde as respostas do destinatário devem ser enviadas
   */
  reply_to?: string | string[];
  replyTo?: string | string[];
  /**
   * Cabeçalhos personalizados (Ex: { "X-Entity-Ref-ID": "12345" })
   */
  headers?: Headers;
  /**
   * Lista de ficheiros anexos
   */
  attachments?: Attachment[];
  /**
   * Tags para rastreio e analytics
   */
  tags?: Tag[];
  /**
   * Data agendada para envio (opcional)
   */
  scheduled_at?: string;
}

export type CreateEmailOptions = CreateEmailBaseOptions;

export interface CreateEmailResponse {
  id: string;
  status: 'queued' | 'sent' | 'delivered' | 'failed' | string;
}
