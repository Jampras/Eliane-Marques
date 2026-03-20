export function isWeakAdminSessionSecret(secret: string) {
  return new Set([
    'super-secret-session-key-change-me',
    'changeme',
    'change-me',
    'admin',
    'defina_um_secret_com_32+_caracteres',
  ]).has(secret.trim().toLowerCase());
}

export function resolveFailFastMode(options: {
  dataQueryFailFast?: 'true' | 'false';
  isBuildPhase: boolean;
  isProductionEnv: boolean;
}) {
  if (options.dataQueryFailFast === 'true') {
    return true;
  }

  if (options.dataQueryFailFast === 'false') {
    return false;
  }

  if (options.isBuildPhase) {
    return false;
  }

  return options.isProductionEnv;
}

export function parseAllowedAdminEmails(raw: string) {
  return raw
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}
