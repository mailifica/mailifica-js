import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Mailifica } from '../src/mailifica';
import { Webhooks } from '../src/webhooks/webhooks';
import * as crypto from 'crypto';

describe('Mailifica JS SDK', () => {
  const apiKey = 'ma_test_123456789';
  let mailifica: Mailifica;

  beforeEach(() => {
    mailifica = new Mailifica(apiKey, { baseUrl: 'https://api.mailifica.com/v1' });
    vi.restoreAllMocks();
  });

  describe('Emails', () => {
    it('should send email with correct headers and payload', async () => {
      const mockResponse = { id: 'email_123', status: 'queued' };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      const response = await mailifica.emails.send({
        from: 'onboarding@empresa.ao',
        to: 'cliente@gmail.com',
        subject: 'Boas-vindas',
        html: '<p>Olá mundo</p>',
      });

      expect(response.data).toEqual(mockResponse);
      expect(response.error).toBeNull();
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.mailifica.com/v1/emails',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          }),
        }),
      );
    });

    it('should retrieve email details by id', async () => {
      const mockEmail = {
        id: 'email_123',
        from: 'onboarding@empresa.ao',
        to: ['cliente@gmail.com'],
        subject: 'Boas-vindas',
        status: 'delivered',
        created_at: '2026-08-29T12:00:00Z',
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockEmail,
      });

      const response = await mailifica.emails.get('email_123');
      expect(response.data).toEqual(mockEmail);
      expect(response.error).toBeNull();
    });
  });

  describe('Batch', () => {
    it('should send batch emails', async () => {
      const mockResponse = {
        data: [
          { id: 'email_1', status: 'queued' },
          { id: 'email_2', status: 'queued' },
        ],
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      const response = await mailifica.batch.send([
        { from: 'test@empresa.ao', to: 'a@a.com', subject: '1', html: '<p>1</p>' },
        { from: 'test@empresa.ao', to: 'b@b.com', subject: '2', html: '<p>2</p>' },
      ]);

      expect(response.data).toEqual(mockResponse);
      expect(response.error).toBeNull();
    });
  });

  describe('Domains', () => {
    it('should list and verify domains', async () => {
      const mockDomain = {
        id: 'dom_123',
        name: 'empresa.ao',
        status: 'verified',
        records: [],
        created_at: '2026-08-29T12:00:00Z',
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockDomain,
      });

      const res = await mailifica.domains.verify('dom_123');
      expect(res.data).toEqual(mockDomain);
    });
  });

  describe('Webhooks', () => {
    const webhooks = new Webhooks();
    const secret = 'whsec_test_secret_123';
    const payload = JSON.stringify({
      id: 'evt_123',
      type: 'email.delivered',
      created_at: '2026-08-29T12:00:00Z',
      data: { email_id: 'email_123', from: 'a@b.ao', to: ['c@d.ao'], subject: 'Oi', status: 'delivered' },
    });

    it('should verify valid HMAC signature and construct event', () => {
      const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
      const isValid = webhooks.verifySignature({ payload, signature, secret });
      expect(isValid).toBe(true);

      const event = webhooks.constructEvent({ payload, signature, secret });
      expect(event.id).toBe('evt_123');
      expect(event.type).toBe('email.delivered');
    });

    it('should reject invalid HMAC signature', () => {
      const isValid = webhooks.verifySignature({ payload, signature: 'invalid_sig', secret });
      expect(isValid).toBe(false);

      expect(() => {
        webhooks.constructEvent({ payload, signature: 'invalid_sig', secret });
      }).toThrow();
    });
  });
});
