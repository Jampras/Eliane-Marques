function isFailFastEnabled() {
  const flag = process.env.DATA_QUERY_FAIL_FAST?.trim().toLowerCase();

  if (flag === 'true') {
    return true;
  }

  if (flag === 'false') {
    return false;
  }

  return process.env.NODE_ENV === 'production';
}

export async function safeDataQuery<T>(
  context: string,
  query: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await query();
  } catch (error) {
    const message = `[${context}] data query failed`;

    if (process.env.NODE_ENV === 'production') {
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
