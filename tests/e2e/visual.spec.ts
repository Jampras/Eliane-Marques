import { test, expect } from '@playwright/test';
import { test as authTest, expect as authExpect } from './fixtures/auth';

test.describe('Visual QA - Publico', () => {
  test('home hero desktop permanece estavel', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.goto('/');

    await expect(page.locator('main section').first()).toHaveScreenshot('home-hero-desktop.png', {
      animations: 'disabled',
      caret: 'hide',
      scale: 'device',
    });
  });

  test('home hero mobile permanece estavel e sem overflow horizontal', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const widths = await page.evaluate(() => ({
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));

    expect(widths.scrollWidth).toBeLessThanOrEqual(widths.innerWidth + 1);

    await expect(page.locator('main section').first()).toHaveScreenshot('home-hero-mobile.png', {
      animations: 'disabled',
      caret: 'hide',
      scale: 'device',
    });
  });
});

authTest.describe('Visual QA - Admin', () => {
  authTest('sidebar desktop permanece estavel', async ({ adminPage }) => {
    await adminPage.setViewportSize({ width: 1440, height: 1100 });
    await adminPage.goto('/admin');

    await authExpect(adminPage.locator('aside').first()).toHaveScreenshot('admin-sidebar-desktop.png', {
      animations: 'disabled',
      caret: 'hide',
      scale: 'device',
    });
  });

  authTest('menu mobile do admin permanece estavel', async ({ adminPage }) => {
    await adminPage.setViewportSize({ width: 390, height: 844 });
    await adminPage.goto('/admin');

    await adminPage.getByRole('button', { name: /abrir menu administrativo/i }).click();

    await authExpect(
      adminPage.locator('aside[role="dialog"], aside#admin-mobile-menu')
    ).toHaveScreenshot('admin-mobile-menu.png', {
      animations: 'disabled',
      caret: 'hide',
      scale: 'device',
    });
  });
});
