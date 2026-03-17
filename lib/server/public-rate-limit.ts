import 'server-only';
import { Redis } from '@upstash/redis';
import { getUpstashEnv } from '@/lib/env/server';

type PublicRateLimitWindow = {
  count: number;
  expiresAt: number;
};

type PublicRateLimitOptions = {
  limit: number;
  windowMs: number;
};

type PublicRateLimitResult = {
  allowed: boolean;
  retryAfterMs: number;
};

const upstashEnv = getUpstashEnv();
const redis =
  upstashEnv.isConfigured ? new Redis({ url: upstashEnv.url, token: upstashEnv.token }) : null;

const globalForPublicRateLimit = globalThis as unknown as {
  publicRateLimitStore?: Map<string, PublicRateLimitWindow>;
};

const publicRateLimitStore = globalForPublicRateLimit.publicRateLimitStore ?? new Map();
globalForPublicRateLimit.publicRateLimitStore = publicRateLimitStore;

function getMemoryWindow(key: string) {
  const current = publicRateLimitStore.get(key);
  if (!current) {
    return null;
  }

  if (current.expiresAt <= Date.now()) {
    publicRateLimitStore.delete(key);
    return null;
  }

  return current;
}

async function checkMemoryPublicRateLimit(
  key: string,
  options: PublicRateLimitOptions
): Promise<PublicRateLimitResult> {
  const current = getMemoryWindow(key);

  if (!current) {
    publicRateLimitStore.set(key, {
      count: 1,
      expiresAt: Date.now() + options.windowMs,
    });

    return { allowed: true, retryAfterMs: 0 };
  }

  if (current.count >= options.limit) {
    return {
      allowed: false,
      retryAfterMs: Math.max(0, current.expiresAt - Date.now()),
    };
  }

  publicRateLimitStore.set(key, {
    count: current.count + 1,
    expiresAt: current.expiresAt,
  });

  return { allowed: true, retryAfterMs: 0 };
}

async function checkRedisPublicRateLimit(
  key: string,
  options: PublicRateLimitOptions
): Promise<PublicRateLimitResult> {
  const count = await redis!.incr(key);

  if (count === 1) {
    await redis!.expire(key, Math.ceil(options.windowMs / 1000));
  }

  if (count > options.limit) {
    return { allowed: false, retryAfterMs: options.windowMs };
  }

  return { allowed: true, retryAfterMs: 0 };
}

export async function checkPublicRateLimit(
  key: string,
  options: PublicRateLimitOptions
): Promise<PublicRateLimitResult> {
  if (!redis) {
    return checkMemoryPublicRateLimit(key, options);
  }

  try {
    return await checkRedisPublicRateLimit(key, options);
  } catch {
    return checkMemoryPublicRateLimit(key, options);
  }
}
