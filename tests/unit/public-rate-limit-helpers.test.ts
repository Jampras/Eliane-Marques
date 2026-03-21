import assert from 'node:assert/strict';
import test from 'node:test';
import { formatRetryAfterLabel, toRetryAfterSeconds } from '@/lib/server/public-rate-limit-helpers';

test('toRetryAfterSeconds rounds up and never returns zero', () => {
  assert.equal(toRetryAfterSeconds(1), 1);
  assert.equal(toRetryAfterSeconds(1001), 2);
});

test('formatRetryAfterLabel returns seconds below one minute', () => {
  assert.equal(formatRetryAfterLabel(12_000), '12s');
});

test('formatRetryAfterLabel returns minutes for longer windows', () => {
  assert.equal(formatRetryAfterLabel(90_000), '2 min');
});
