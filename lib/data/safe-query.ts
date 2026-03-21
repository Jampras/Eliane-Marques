import { isBuildPhase, isFailFastEnabled, isProductionEnv } from '@/lib/env/server';
import { resolveSafeDataQueryPolicy } from './safe-query-helpers';

export async function safeDataQuery<T>(
  context: string,
  query: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await query();
  } catch (error) {
    const policy = resolveSafeDataQueryPolicy({
      context,
      isBuildPhase: isBuildPhase(),
      isProductionEnv: isProductionEnv(),
      isFailFastEnabled: isFailFastEnabled(),
    });

    if (policy.logMode === 'summary') {
      if (isBuildPhase()) {
        console.warn(policy.message);
      } else {
        console.error(policy.message);
      }
    } else {
      console.error(`[${context}]`, error);
    }

    if (policy.shouldThrow) {
      throw new Error(policy.message, { cause: error });
    }

    return fallback;
  }
}
