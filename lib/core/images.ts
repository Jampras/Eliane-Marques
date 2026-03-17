import { getSupabaseStorageEnv } from '@/lib/env/server';

function getSupabaseHostname() {
  const supabaseUrl = getSupabaseStorageEnv().url;

  if (!supabaseUrl) {
    return null;
  }

  try {
    return new URL(supabaseUrl).hostname;
  } catch {
    return null;
  }
}

const OPTIMIZABLE_HOSTS = new Set(
  ['images.unsplash.com', getSupabaseHostname()].filter(Boolean) as string[]
);

export function shouldOptimizeImage(src?: string | null) {
  if (!src) {
    return false;
  }

  if (src.startsWith('/')) {
    return true;
  }

  try {
    const url = new URL(src);
    return OPTIMIZABLE_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}
