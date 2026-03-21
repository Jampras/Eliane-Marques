import { test, expect } from '@playwright/test';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { createAdminSessionToken, seedAdminSession } from './helpers/admin-session';

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
  test('login page exposes google entry point', async ({ page }) => {
    const loginPage = new AdminLoginPage(page);
    await loginPage.goto();

    await expect(loginPage.googleButton).toBeVisible();
    await expect(loginPage.googleButton).toBeEnabled();
  });

  test('login page no longer exposes password fallback', async ({ page }) => {
    const loginPage = new AdminLoginPage(page);
    await loginPage.goto();

    await expect(loginPage.passwordInput).toHaveCount(0);
    await expect(loginPage.passwordButton).toHaveCount(0);
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

  test('upload endpoint rejects revoked admin cookies', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/admin/login');

    const token = await createAdminSessionToken('revoked@example.com');

    await page.context().addCookies([
      {
        name: 'admin_session',
        value: token,
        url: page.url(),
      },
    ]);

    const result = await postUploadViaBrowser(page);

    expect(result.status).toBe(401);
    expect(result.body.error).toMatch(/autorizado/i);
  });

  test('upload endpoint blocks cross-origin requests even with a valid session', async ({
    request,
  }) => {
    const token = await createAdminSessionToken();
    const response = await request.post('/api/upload', {
      headers: {
        Origin: 'https://evil.example.com',
        Cookie: `admin_session=${token}`,
      },
      multipart: {
        file: {
          name: 'test.png',
          mimeType: 'image/png',
          buffer: Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
        },
      },
    });

    expect(response.status()).toBe(403);
    await expect(response.json()).resolves.toMatchObject({
      error: expect.stringMatching(/origem/i),
    });
  });

  test('callback route redirects back to login when oauth session is invalid', async ({ page }) => {
    await page.goto('/auth/admin/callback?next=/admin');

    await expect(page).toHaveURL(/\/admin\/login\?error=/);
  });

  test('logout destroys session and redirects to login', async ({ page }) => {
    await seedAdminSession(page);
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin$/);

    const logoutButton = page
      .getByRole('button', { name: /sair|logout/i })
      .or(page.getByRole('link', { name: /sair|logout/i }));

    await logoutButton.click();

    await expect(page).toHaveURL(/\/admin\/login/);

    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});
