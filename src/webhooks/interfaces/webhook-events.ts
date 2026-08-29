export type WebhookEventType =
  | 'email.sent'
  | 'email.delivered'
  | 'email.delivery_delayed'
  | 'email.bounced'
  | 'email.complained'
  | 'email.opened'
  | 'email.clicked'
  | string;

export interface WebhookEvent<T = Record<string, unknown>> {
  id: string;
  type: WebhookEventType;
  created_at: string;
  data: {
    email_id: string;
    from: string;
    to: string[];
    subject: string;
    status: string;
  } & T;
}
