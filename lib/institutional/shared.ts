export const INSTITUTIONAL_REVALIDATE_PATHS = [
  '/',
  '/contato',
  '/servicos',
  '/cursos',
  '/materiais',
  '/checklists',
  '/conteudos',
  '/sobre',
] as const;

export const SITE_CONFIGS_TAG = 'site-configs';
export const ABOUT_PAGE_TAG = 'about-page';
export const HOME_PAGE_TAG = 'home-page';
export const ABOUT_SINGLETON_KEY = 'main';
export const HOME_SINGLETON_KEY = 'main';

export function normalizeOptionalInstitutionalText(value: string | undefined) {
  if (value === undefined) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}
