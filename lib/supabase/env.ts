import { getClientSupabaseEnv } from '@/lib/env/client';

export function getSupabasePublicUrl() {
  return getClientSupabaseEnv().url;
}

export function getSupabasePublicKey() {
  return getClientSupabaseEnv().key;
}

export function isSupabaseOAuthConfigured() {
  return getClientSupabaseEnv().isConfigured;
}
