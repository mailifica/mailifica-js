export interface ApiKeyItem {
  id: string;
  name: string;
  token?: string;
  prefix: string;
  created_at: string;
}

export interface CreateApiKeyOptions {
  name: string;
  permission?: 'full_access' | 'sending_access' | string;
}
