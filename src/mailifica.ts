import { ApiKeys } from './api-keys/api-keys';
import { Batch } from './batch/batch';
import { ClientOptions, HttpClient } from './common/client';
import { Domains } from './domains/domains';
import { Emails } from './emails/emails';
import { Webhooks } from './webhooks/webhooks';

export class Mailifica {
  private readonly client: HttpClient;

  readonly emails: Emails;
  readonly batch: Batch;
  readonly domains: Domains;
  readonly apiKeys: ApiKeys;
  readonly webhooks: Webhooks;

  constructor(apiKey?: string, options?: ClientOptions) {
    this.client = new HttpClient(apiKey, options);

    this.emails = new Emails(this.client);
    this.batch = new Batch(this.client);
    this.domains = new Domains(this.client);
    this.apiKeys = new ApiKeys(this.client);
    this.webhooks = new Webhooks();
  }
}

/**
 * Alias de compatibilidade com minúsculas
 */
export const mailifica = Mailifica;
export default Mailifica;
