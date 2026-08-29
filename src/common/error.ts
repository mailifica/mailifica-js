export interface ErrorResponse {
  message: string;
  name: string;
  statusCode?: number;
}

export class MailificaError extends Error {
  readonly statusCode?: number;
  readonly type: string;

  constructor(message: string, statusCode?: number, type = 'mailifica_error') {
    super(message);
    this.name = 'MailificaError';
    this.statusCode = statusCode;
    this.type = type;
    Object.setPrototypeOf(this, MailificaError.prototype);
  }
}
