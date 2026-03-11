import { test as base, type Page } from '@playwright/test';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? '';

type AuthFixtures = {
  adminPage: Page;
};

/**
 * Fixture that provides a pre-authenticated admin Page.
 * Logs in via the login form before each test and reuses the session.
 */
export const test = base.extend<AuthFixtures>({
  adminPage: async ({ page }, use) => {
    await page.goto('/admin/login');

    await page.locator('input[name="password"]').fill(ADMIN_PASSWORD);
    await page.getByRole('button', { name: /entrar/i }).click();

    // Wait for the redirect to the admin dashboard
    await page.waitForURL('**/admin', { timeout: 15_000 });

    await use(page);
  },
});

export { expect } from '@playwright/test';
