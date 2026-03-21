import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveSafeDataQueryPolicy } from '@/lib/data/safe-query-helpers';

test('resolveSafeDataQueryPolicy fails fast when explicitly enabled', () => {
  const result = resolveSafeDataQueryPolicy({
    context: 'getHomePage',
    isBuildPhase: false,
    isProductionEnv: true,
    isFailFastEnabled: true,
  });

  assert.deepEqual(result, {
    message: '[getHomePage] data query failed',
    shouldThrow: true,
    logMode: 'summary',
  });
});

test('resolveSafeDataQueryPolicy uses verbose logging in local degraded mode', () => {
  const result = resolveSafeDataQueryPolicy({
    context: 'getHomePage',
    isBuildPhase: false,
    isProductionEnv: false,
    isFailFastEnabled: false,
  });

  assert.deepEqual(result, {
    message: '[getHomePage] data query failed',
    shouldThrow: false,
    logMode: 'verbose',
  });
});
