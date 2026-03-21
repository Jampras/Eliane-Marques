export function resolveSafeDataQueryPolicy(options: {
  context: string;
  isBuildPhase: boolean;
  isProductionEnv: boolean;
  isFailFastEnabled: boolean;
}) {
  const message = `[${options.context}] data query failed`;

  if (options.isFailFastEnabled) {
    return {
      message,
      shouldThrow: true,
      logMode: options.isBuildPhase || options.isProductionEnv ? 'summary' : 'verbose',
    } as const;
  }

  return {
    message,
    shouldThrow: false,
    logMode: options.isBuildPhase || options.isProductionEnv ? 'summary' : 'verbose',
  } as const;
}
