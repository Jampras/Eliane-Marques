'use client';

import { createBrowserClient } from '@supabase/ssr';
import { getSupabasePublicKey, getSupabasePublicUrl } from './env';

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function createSupabaseBrowserClient() {
  if (browserClient) {
    return browserClient;
  }

  const url = getSupabasePublicUrl();
  const key = getSupabasePublicKey();

  if (!url || !key) {
    throw new Error('Supabase OAuth nao configurado. Defina as variaveis publicas do Supabase.');
  }

  browserClient = createBrowserClient(url, key);
  return browserClient;
}
