import { test, expect } from '@playwright/test';
import { seedAdminSession } from './helpers/admin-session';

async function loginAsAdmin(page: import('@playwright/test').Page) {
  await seedAdminSession(page);
  await page.goto('/admin');
  await page.waitForURL('**/admin', { timeout: 15_000 });
}

test.describe('Institutional public routes QA', () => {
  test('admin login exposes Google flow only', async ({ page }) => {
    await page.goto('/admin/login');

    await expect(page.getByRole('button', { name: /entrar com google/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /entrar com senha/i })).toHaveCount(0);
    await expect(page.getByLabel(/senha de acesso/i)).toHaveCount(0);
  });

  test('public sobre page renders institutional sections', async ({ page }) => {
    await page.goto('/sobre');

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { name: /areas de atuacao/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /marcos que sustentam/i })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /certificados, selos e especializacoes/i })
    ).toBeVisible();
  });
});

test.describe('Institutional admin routes QA', () => {
  test('admin config page renders and stays usable', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/config');

    await expect(page.getByRole('heading', { name: /configuracoes gerais/i })).toBeVisible();
    await expect(page.getByLabel(/whatsapp \(com ddd\)/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /publicar alteracoes/i })).toBeVisible();
  });

  test('admin sobre page renders institutional editor', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/sobre');

    await expect(page.getByRole('heading', { name: /pagina sobre/i })).toBeVisible();
    await expect(page.getByLabel(/titulo principal/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /adicionar marco/i })).toBeVisible();
    await expect(
      page.getByRole('link', { name: /abrir pagina publica/i })
    ).toHaveAttribute('href', '/sobre');
  });
});
