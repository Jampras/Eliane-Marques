import assert from 'node:assert/strict';
import test from 'node:test';
import { isSameOriginRequest } from '@/lib/server/request-security-helpers';

test('accepts requests with matching origin header', () => {
  const headers = new Headers({
    host: 'v03-pink.vercel.app',
    'x-forwarded-proto': 'https',
    origin: 'https://v03-pink.vercel.app',
  });

  assert.equal(isSameOriginRequest(headers), true);
});

test('accepts requests with matching referrer when origin is absent', () => {
  const headers = new Headers({
    host: 'v03-pink.vercel.app',
    'x-forwarded-proto': 'https',
    referer: 'https://v03-pink.vercel.app/contato',
  });

  assert.equal(isSameOriginRequest(headers), true);
});

test('rejects requests without origin and referrer', () => {
  const headers = new Headers({
    host: 'v03-pink.vercel.app',
    'x-forwarded-proto': 'https',
  });

  assert.equal(isSameOriginRequest(headers), false);
});

test('rejects requests from another origin', () => {
  const headers = new Headers({
    host: 'v03-pink.vercel.app',
    'x-forwarded-proto': 'https',
    origin: 'https://evil.example.com',
  });

  assert.equal(isSameOriginRequest(headers), false);
});
