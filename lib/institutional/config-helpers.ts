export function buildConfigEntries(validated: Record<string, string | undefined>) {
  return Object.entries(validated).filter(([, value]) => value !== undefined) as Array<
    [keyof typeof validated, string]
  >;
}
