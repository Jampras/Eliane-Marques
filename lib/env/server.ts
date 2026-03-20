import 'server-only';

import { z } from 'zod';
import {
  isWeakAdminSessionSecret,
  parseAllowedAdminEmails,
  resolveFailFastMode,
} from './server-helpers';

const optionalTrimmedString = z.preprocess((value) => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}, z.string().optional());

const optionalUrl = z.preprocess((value) => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}, z.string().url().optional());

const runtimeSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  NEXT_PHASE: optionalTrimmedString,
  NEXT_PUBLIC_SITE_URL: optionalUrl,
  DATA_QUERY_FAIL_FAST: z.enum(['true', 'false']).optional(),
  E2E_DISABLE_RATE_LIMIT: z.enum(['true', 'false']).optional(),
});

const adminSessionSchema = z.object({
  ADMIN_SESSION_SECRET: z.string().min(32),
});

const upstashSchema = z.object({
  UPSTASH_REDIS_REST_URL: optionalUrl,
  UPSTASH_REDIS_REST_TOKEN: optionalTrimmedString,
});

const supabaseStorageSchema = z.object({
  SUPABASE_URL: optionalUrl,
  SUPABASE_SERVICE_ROLE_KEY: optionalTrimmedString,
  SUPABASE_STORAGE_BUCKET: optionalTrimmedString,
});

const supabasePublicSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: optionalUrl,
  SUPABASE_URL: optionalUrl,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: optionalTrimmedString,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: optionalTrimmedString,
});

const adminGoogleSchema = z.object({
  ADMIN_GOOGLE_ALLOWED_EMAILS: optionalTrimmedString,
  ADMIN_ALLOWED_EMAILS: optionalTrimmedString,
});

const runtime = runtimeSchema.parse(process.env);
const adminSessionEnv = adminSessionSchema.safeParse(process.env);
const upstashEnv = upstashSchema.parse(process.env);
const supabaseStorageEnv = supabaseStorageSchema.parse(process.env);
const supabasePublicEnv = supabasePublicSchema.parse(process.env);
const adminGoogleEnv = adminGoogleSchema.parse(process.env);

export function getNodeEnv() {
  return runtime.NODE_ENV;
}

export function isProductionEnv() {
  return getNodeEnv() === 'production';
}

export function isBuildPhase() {
  return runtime.NEXT_PHASE === 'phase-production-build';
}

export function getPublicSiteUrl() {
  return runtime.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}

export function isFailFastEnabled() {
  return resolveFailFastMode({
    dataQueryFailFast: runtime.DATA_QUERY_FAIL_FAST,
    isBuildPhase: isBuildPhase(),
    isProductionEnv: isProductionEnv(),
  });
}

export function isRateLimitBypassedForTests() {
  return runtime.E2E_DISABLE_RATE_LIMIT === 'true';
}

export function getAdminSessionSecret() {
  if (!adminSessionEnv.success) {
    throw new Error('CRITICAL: ADMIN_SESSION_SECRET is not defined in environment variables.');
  }

  const secret = adminSessionEnv.data.ADMIN_SESSION_SECRET;
  if (isWeakAdminSessionSecret(secret)) {
    throw new Error(
      'CRITICAL: ADMIN_SESSION_SECRET is weak. Use a random secret with at least 32 characters.'
    );
  }

  return secret;
}

export function getSupabaseStorageEnv() {
  const url = supabaseStorageEnv.SUPABASE_URL || '';
  const serviceRoleKey = supabaseStorageEnv.SUPABASE_SERVICE_ROLE_KEY || '';
  const bucket = supabaseStorageEnv.SUPABASE_STORAGE_BUCKET || 'uploads';

  return {
    url,
    serviceRoleKey,
    bucket,
    isConfigured: Boolean(url && serviceRoleKey),
  };
}

export function requireSupabaseStorageEnv() {
  const env = getSupabaseStorageEnv();
  if (!env.isConfigured) {
    throw new Error(
      'CRITICAL: Supabase storage must be configured in production. Local upload fallback is disabled.'
    );
  }

  return env;
}

export function getSupabasePublicEnv() {
  const url = supabasePublicEnv.NEXT_PUBLIC_SUPABASE_URL || supabasePublicEnv.SUPABASE_URL || '';
  const key =
    supabasePublicEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    supabasePublicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    '';

  return {
    url,
    key,
    isConfigured: Boolean(url && key),
  };
}

export function requireSupabasePublicEnv() {
  const env = getSupabasePublicEnv();
  if (!env.isConfigured) {
    throw new Error('Supabase OAuth nao configurado. Defina as variaveis publicas do Supabase.');
  }

  return env;
}

export function getUpstashEnv() {
  const url = upstashEnv.UPSTASH_REDIS_REST_URL || '';
  const token = upstashEnv.UPSTASH_REDIS_REST_TOKEN || '';

  return {
    url,
    token,
    isConfigured: Boolean(url && token),
  };
}

export function requireUpstashEnv() {
  const env = getUpstashEnv();
  if (!env.isConfigured) {
    throw new Error(
      'CRITICAL: Upstash Redis is required in production for distributed login rate limiting.'
    );
  }

  return env;
}

export function getAllowedAdminGoogleEmails() {
  const raw = adminGoogleEnv.ADMIN_GOOGLE_ALLOWED_EMAILS || adminGoogleEnv.ADMIN_ALLOWED_EMAILS || '';

  return parseAllowedAdminEmails(raw);
}
