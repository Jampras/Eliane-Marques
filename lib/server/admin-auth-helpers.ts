import type { JWTPayload } from 'jose';

export function isAuthorizedAdminSessionPayload(
  payload: JWTPayload | null | undefined,
  isAllowedAdminEmail: (email: string) => boolean
): payload is JWTPayload & { admin: true; role: 'admin'; email: string } {
  return Boolean(
    payload &&
    payload.admin === true &&
    payload.role === 'admin' &&
    typeof payload.email === 'string' &&
    isAllowedAdminEmail(payload.email)
  );
}
