import { MailificaResponse } from './response';

export interface ClientOptions {
  apiKey?: string;
  baseUrl?: string;
  headers?: Record<string, string>;
}

export class HttpClient {
  readonly apiKey: string;
  readonly baseUrl: string;

  constructor(apiKey?: string, options: ClientOptions = {}) {
    this.apiKey = apiKey || (typeof process !== 'undefined' ? process.env.MAILIFICA_API_KEY || '' : '');
    this.baseUrl = (options.baseUrl || (typeof process !== 'undefined' ? process.env.MAILIFICA_BASE_URL : undefined) || 'https://api.mailifica.com/v1').replace(/\/$/, '');

    if (!this.apiKey) {
      throw new Error(
        'Chave de API em falta. Forneça no construtor `new Mailifica("ma_...")` ou configure a variável de ambiente `MAILIFICA_API_KEY`.',
      );
    }
  }

  async request<T>(path: string, options: RequestInit = {}): Promise<MailificaResponse<T>> {
    const url = `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'User-Agent': 'mailifica-js/1.0.0',
      ...(options.headers as Record<string, string>),
    };

    try {
      const res = await fetch(url, {
        ...options,
        headers,
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        return {
          data: null,
          error: {
            message: json?.error?.message || json?.message || `A requisição falhou com status ${res.status}`,
            name: json?.error?.code || 'mailifica_api_error',
            statusCode: res.status,
          },
        };
      }

      return {
        data: json as T,
        error: null,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Falha na conexão com os servidores Mailifica';
      return {
        data: null,
        error: {
          message,
          name: 'network_error',
        },
      };
    }
  }

  async get<T>(path: string): Promise<MailificaResponse<T>> {
    return this.request<T>(path, { method: 'GET' });
  }

  async post<T>(path: string, body?: unknown): Promise<MailificaResponse<T>> {
    return this.request<T>(path, {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(path: string, body?: unknown): Promise<MailificaResponse<T>> {
    return this.request<T>(path, {
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(path: string): Promise<MailificaResponse<T>> {
    return this.request<T>(path, { method: 'DELETE' });
  }
}
