import { z } from 'zod';

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

const clientEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: optionalUrl,
  NEXT_PUBLIC_SUPABASE_URL: optionalUrl,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: optionalTrimmedString,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: optionalTrimmedString,
});

const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});

export function getClientSiteUrl() {
  return clientEnv.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}

export function getClientSupabaseEnv() {
  const url = clientEnv.NEXT_PUBLIC_SUPABASE_URL || '';
  const key =
    clientEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  return {
    url,
    key,
    isConfigured: Boolean(url && key),
  };
}
