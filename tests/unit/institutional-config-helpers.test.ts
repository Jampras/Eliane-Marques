import assert from 'node:assert/strict';
import test from 'node:test';
import { buildConfigEntries } from '@/lib/institutional/config-helpers';

test('buildConfigEntries keeps only defined config values', () => {
  const result = buildConfigEntries({
    siteName: 'Eliane Marques',
    themePreset: 'classico',
    instagramLink: undefined,
  });

  assert.deepEqual(result, [
    ['siteName', 'Eliane Marques'],
    ['themePreset', 'classico'],
  ]);
});
