import 'server-only';
import { createHash } from 'node:crypto';

const KNOWN_EXPOSED_SUPABASE_SERVICE_ROLE_KEY_SHA256 =
  'fa41c2e6eb4b2ada173c70c80efdfa714e2c4017abb58e5d9888ed60518dd6b7';
let hasWarnedAboutCompromisedServiceRoleKey = false;

function sha256(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

function isBlank(value: string | undefined) {
  return !value || value.trim() === '';
}

export function ensureDistributedRateLimitConfigured() {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  if (
    isBlank(process.env.UPSTASH_REDIS_REST_URL) ||
    isBlank(process.env.UPSTASH_REDIS_REST_TOKEN)
  ) {
    throw new Error(
      'CRITICAL: Upstash Redis is required in production for distributed login rate limiting.'
    );
  }
}

export function ensureProductionUploadConfig() {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  if (
    isBlank(process.env.SUPABASE_URL) ||
    isBlank(process.env.SUPABASE_SERVICE_ROLE_KEY) ||
    isBlank(process.env.SUPABASE_STORAGE_BUCKET)
  ) {
    throw new Error(
      'CRITICAL: Supabase storage must be configured in production. Local upload fallback is disabled.'
    );
  }
}

export function ensureServiceRoleKeyNotCompromised() {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!key) {
    return;
  }

  if (
    sha256(key) === KNOWN_EXPOSED_SUPABASE_SERVICE_ROLE_KEY_SHA256 &&
    !hasWarnedAboutCompromisedServiceRoleKey
  ) {
    hasWarnedAboutCompromisedServiceRoleKey = true;
    console.warn(
      'SECURITY WARNING: The configured SUPABASE_SERVICE_ROLE_KEY is known to be exposed. Uploads remain enabled by operator decision. Rotate this key as soon as possible.'
    );
  }
}
