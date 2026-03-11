import 'server-only';
import { Redis } from '@upstash/redis';

interface RateLimitEntry {
  failures: number;
  firstFailureAt: number;
  blockedUntil: number;
}

const MAX_FAILURES = 5;
const WINDOW_MS = 10 * 60 * 1000;
const BLOCK_MS = 15 * 60 * 1000;

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;

function blockKey(key: string) {
  return `${key}:blocked_until`;
}

function failuresKey(key: string) {
  return `${key}:failures`;
}

function logRateLimitError(context: string, error: unknown) {
  if (process.env.NODE_ENV === 'production') {
    const safeMessage = error instanceof Error ? error.message : String(error);
    console.error(`[rate-limit:${context}] ${safeMessage}`);
    return;
  }

  console.error(`[rate-limit:${context}]`, error);
}

async function getRedisBlockRemainingMs(key: string) {
  if (!redis) {
    return 0;
  }

  const blockedUntil = await redis.get<number>(blockKey(key));
  if (!blockedUntil) {
    return 0;
  }

  const remaining = blockedUntil - Date.now();
  if (remaining > 0) {
    return remaining;
  }

  await redis.del(blockKey(key));
  return 0;
}

async function registerRedisFailure(key: string) {
  if (!redis) {
    return;
  }

  const now = Date.now();
  const currentlyBlockedUntil = await redis.get<number>(blockKey(key));

  if (currentlyBlockedUntil && currentlyBlockedUntil > now) {
    return;
  }

  const failures = await redis.incr(failuresKey(key));

  if (failures === 1) {
    await redis.expire(failuresKey(key), Math.ceil(WINDOW_MS / 1000));
  }

  if (failures >= MAX_FAILURES) {
    const blockedUntil = now + BLOCK_MS;
    await redis.set(blockKey(key), blockedUntil, { px: BLOCK_MS });
    await redis.del(failuresKey(key));
  }
}

async function clearRedisFailures(key: string) {
  if (!redis) {
    return;
  }

  await redis.del(blockKey(key));
  await redis.del(failuresKey(key));
}

const globalForRateLimit = globalThis as unknown as {
  loginRateLimitStore?: Map<string, RateLimitEntry>;
};

const loginRateLimitStore =
  globalForRateLimit.loginRateLimitStore ?? new Map<string, RateLimitEntry>();

if (process.env.NODE_ENV !== 'production') {
  globalForRateLimit.loginRateLimitStore = loginRateLimitStore;
}

function getMemoryBlockRemainingMs(key: string) {
  const current = loginRateLimitStore.get(key);
  if (!current) {
    return 0;
  }

  const now = Date.now();
  if (current.blockedUntil > now) {
    return current.blockedUntil - now;
  }

  return 0;
}

function registerMemoryFailure(key: string) {
  const now = Date.now();
  const current = loginRateLimitStore.get(key);

  if (!current || now - current.firstFailureAt > WINDOW_MS) {
    loginRateLimitStore.set(key, {
      failures: 1,
      firstFailureAt: now,
      blockedUntil: 0,
    });
    return;
  }

  const nextFailures = current.failures + 1;

  if (nextFailures >= MAX_FAILURES) {
    loginRateLimitStore.set(key, {
      failures: nextFailures,
      firstFailureAt: current.firstFailureAt,
      blockedUntil: now + BLOCK_MS,
    });
    return;
  }

  loginRateLimitStore.set(key, {
    failures: nextFailures,
    firstFailureAt: current.firstFailureAt,
    blockedUntil: 0,
  });
}

function clearMemoryFailures(key: string) {
  loginRateLimitStore.delete(key);
}

export async function getLoginBlockRemainingMs(key: string) {
  if (!redis) {
    return getMemoryBlockRemainingMs(key);
  }

  try {
    return await getRedisBlockRemainingMs(key);
  } catch (error) {
    logRateLimitError('get-block-remaining', error);
    return getMemoryBlockRemainingMs(key);
  }
}

export async function registerLoginFailure(key: string) {
  if (!redis) {
    registerMemoryFailure(key);
    return;
  }

  try {
    await registerRedisFailure(key);
  } catch (error) {
    logRateLimitError('register-failure', error);
    registerMemoryFailure(key);
  }
}

export async function clearLoginFailures(key: string) {
  if (!redis) {
    clearMemoryFailures(key);
    return;
  }

  try {
    await clearRedisFailures(key);
  } catch (error) {
    logRateLimitError('clear-failures', error);
    clearMemoryFailures(key);
  }
}
