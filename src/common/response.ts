import { ErrorResponse } from './error';

/**
 * Padrão de retorno discriminado (Data ou Error)
 */
export type MailificaResponse<T> =
  | {
      data: T;
      error: null;
    }
  | {
      data: null;
      error: ErrorResponse;
    };
