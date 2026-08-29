export interface GetEmailResponse {
  id: string;
  from: string;
  to: string[];
  subject: string;
  html?: string;
  text?: string;
  status: 'queued' | 'sent' | 'delivered' | 'bounced' | 'failed' | 'suppressed' | string;
  created_at: string;
  last_event?: string;
}
