import { describe, expect, it } from 'vitest';

import { contactSchema } from '@/app/api/contact/schema';

describe('contactSchema', () => {
  it('accepts valid payloads', () => {
    const payload = {
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      message: 'Building luminous experiences together.'
    };

    expect(() => contactSchema.parse(payload)).not.toThrow();
  });

  it('rejects short messages', () => {
    const payload = {
      name: 'A',
      email: 'invalid-email',
      message: 'Hello'
    };

    expect(() => contactSchema.parse(payload)).toThrow();
  });

  it('trims whitespace before validation', () => {
    const payload = {
      name: '  Team BitPoet  ',
      email: ' founder@bitpoet.dev ',
      message: '   Resonant software awaits.   '
    };

    const parsed = contactSchema.parse(payload);

    expect(parsed.name).toBe(payload.name.trim());
    expect(parsed.email).toBe(payload.email.trim());
    expect(parsed.message).toBe(payload.message.trim());
  });
});
