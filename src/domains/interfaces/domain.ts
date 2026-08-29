export interface DomainRecord {
  record: 'SPF' | 'DKIM' | 'DMARC' | 'MX' | string;
  name: string;
  type: string;
  value: string;
  status: 'valid' | 'invalid' | 'pending' | string;
  priority?: number;
}

export interface DomainItem {
  id: string;
  name: string;
  status: 'pending' | 'verified' | 'failed' | string;
  records: DomainRecord[];
  region?: string;
  created_at: string;
}
