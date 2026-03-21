import assert from 'node:assert/strict';
import test from 'node:test';
import { isAuthorizedAdminSessionPayload } from '@/lib/server/admin-auth-helpers';

test('accepts admin payload with allowed email', () => {
  const payload = {
    admin: true,
    role: 'admin',
    email: 'admin@example.com',
  };

  assert.equal(
    isAuthorizedAdminSessionPayload(payload, (email) => email === 'admin@example.com'),
    true
  );
});

test('rejects payload when email is no longer allowed', () => {
  const payload = {
    admin: true,
    role: 'admin',
    email: 'revoked@example.com',
  };

  assert.equal(
    isAuthorizedAdminSessionPayload(payload, () => false),
    false
  );
});

test('rejects payload missing admin claims', () => {
  const payload = {
    role: 'admin',
    email: 'admin@example.com',
  };

  assert.equal(
    isAuthorizedAdminSessionPayload(payload, (email) => email === 'admin@example.com'),
    false
  );
});
