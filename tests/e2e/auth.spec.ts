import { test, expect } from '@playwright/test';
import { AdminLoginPage } from './pages/AdminLoginPage';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? '';

async function postUploadViaBrowser(page: import('@playwright/test').Page) {
  return page.evaluate(async () => {
    const formData = new FormData();
    formData.append(
      'file',
      new File([new Uint8Array([137, 80, 78, 71])], 'test.png', { type: 'image/png' })
    );

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    return {
      status: response.status,
      body: await response.json(),
    };
  });
}

test.describe('Admin Authentication Flow', () => {
  test('login with correct password redirects to /admin', async ({ page }) => {
    const loginPage = new AdminLoginPage(page);
    await loginPage.goto();

    await loginPage.login(ADMIN_PASSWORD);

    await expect(page).toHaveURL(/\/admin$/);
    await expect(
      page.getByRole('heading', { name: /Dashboard Administrativo/i })
    ).toBeVisible();
  });

  test('login with wrong password shows error and stays on login', async ({ page }) => {
    const loginPage = new AdminLoginPage(page);
    await loginPage.goto();

    await loginPage.login('wrong_password_12345');

    const error = await loginPage.getError();
    expect(error).toContain('Senha incorreta');

    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('direct access to /admin without session redirects to /admin/login', async ({ page }) => {
    await page.context().clearCookies();

    await page.goto('/admin');

    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('upload endpoint rejects requests without a valid session', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/admin/login');

    const result = await postUploadViaBrowser(page);

    expect(result.status).toBe(401);
    expect(result.body.error).toMatch(/autorizado/i);
  });

  test('upload endpoint rejects forged admin_session cookies', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/admin/login');

    await page.context().addCookies([
      {
        name: 'admin_session',
        value: 'forged.invalid.token',
        url: page.url(),
      },
    ]);

    const result = await postUploadViaBrowser(page);

    expect(result.status).toBe(401);
    expect(result.body.error).toMatch(/autorizado/i);
  });

  test('logout destroys session and redirects to login', async ({ page }) => {
    const loginPage = new AdminLoginPage(page);
    await loginPage.goto();
    await loginPage.login(ADMIN_PASSWORD);
    await expect(page).toHaveURL(/\/admin$/);

    const logoutButton = page.getByRole('button', { name: /sair|logout/i })
      .or(page.getByRole('link', { name: /sair|logout/i }));

    await logoutButton.evaluate((button) => {
      const form = (button as HTMLButtonElement).form;
      if (!form) {
        throw new Error('Logout form not found');
      }

      form.requestSubmit();
    });

    await expect(page).toHaveURL(/\/admin\/login/);

    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});
