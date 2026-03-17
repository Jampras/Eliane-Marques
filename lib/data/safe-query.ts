import { isFailFastEnabled, isProductionEnv } from '@/lib/env/server';

export async function safeDataQuery<T>(
  context: string,
  query: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await query();
  } catch (error) {
    const message = `[${context}] data query failed`;

    if (isProductionEnv()) {
      console.error(message);
    } else {
      console.error(`[${context}]`, error);
    }

    if (isFailFastEnabled()) {
      throw new Error(message, { cause: error });
    }

    return fallback;
  }
}
