import assert from 'node:assert/strict';
import test from 'node:test';
import {
  isWeakAdminSessionSecret,
  parseAllowedAdminEmails,
  resolveFailFastMode,
} from '@/lib/env/server-helpers';

test('resolveFailFastMode honors explicit true flag', () => {
  assert.equal(
    resolveFailFastMode({
      dataQueryFailFast: 'true',
      isBuildPhase: true,
      isProductionEnv: false,
    }),
    true
  );
});

test('resolveFailFastMode disables fail-fast during build by default', () => {
  assert.equal(
    resolveFailFastMode({
      isBuildPhase: true,
      isProductionEnv: true,
    }),
    false
  );
});

test('resolveFailFastMode enables fail-fast in production by default', () => {
  assert.equal(
    resolveFailFastMode({
      isBuildPhase: false,
      isProductionEnv: true,
    }),
    true
  );
});

test('parseAllowedAdminEmails normalizes and removes empties', () => {
  assert.deepEqual(
    parseAllowedAdminEmails('  Admin@One.com, , second@example.com  ,THIRD@EXAMPLE.COM'),
    ['admin@one.com', 'second@example.com', 'third@example.com']
  );
});

test('isWeakAdminSessionSecret detects known weak secrets', () => {
  assert.equal(isWeakAdminSessionSecret(' changeme '), true);
  assert.equal(
    isWeakAdminSessionSecret('this-is-a-long-random-secret-with-more-than-32-characters'),
    false
  );
});
