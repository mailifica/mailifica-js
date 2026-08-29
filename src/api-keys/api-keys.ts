import { HttpClient } from '../common/client';
import { MailificaResponse } from '../common/response';
import { ApiKeyItem, CreateApiKeyOptions } from './interfaces/api-key';

export class ApiKeys {
  constructor(private readonly client: HttpClient) {}

  async create(payload: CreateApiKeyOptions): Promise<MailificaResponse<ApiKeyItem>> {
    return this.client.post<ApiKeyItem>('/api-keys', payload);
  }

  async list(): Promise<MailificaResponse<{ data: ApiKeyItem[] }>> {
    return this.client.get<{ data: ApiKeyItem[] }>('/api-keys');
  }

  async remove(id: string): Promise<MailificaResponse<{ id: string; deleted: boolean }>> {
    return this.client.delete<{ id: string; deleted: boolean }>(`/api-keys/${id}`);
  }
}
