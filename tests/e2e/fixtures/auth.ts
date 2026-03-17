import { test as base, type Page } from '@playwright/test';
import { seedAdminSession } from '../helpers/admin-session';

type AuthFixtures = {
  adminPage: Page;
};

/**
 * Fixture that provides a pre-authenticated admin Page.
 * Seeds a valid admin_session cookie before each test.
 */
export const test = base.extend<AuthFixtures>({
  adminPage: async ({ page }, use) => {
    await seedAdminSession(page);
    await page.goto('/admin');
    await page.waitForURL('**/admin', { timeout: 15_000 });

    await use(page);
  },
});

export { expect } from '@playwright/test';
