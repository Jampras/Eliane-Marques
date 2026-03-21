export function toRetryAfterSeconds(retryAfterMs: number) {
  return Math.max(1, Math.ceil(retryAfterMs / 1000));
}

export function formatRetryAfterLabel(retryAfterMs: number) {
  const seconds = toRetryAfterSeconds(retryAfterMs);

  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.ceil(seconds / 60);
  return `${minutes} min`;
}
