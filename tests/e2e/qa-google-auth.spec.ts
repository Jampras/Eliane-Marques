import { test, expect } from '@playwright/test';

test.describe('Google admin OAuth QA', () => {
  test('google login redirects to Supabase/Google OAuth flow', async ({ page }) => {
    await page.goto('/admin/login');

    const googleButton = page.getByRole('button', { name: /entrar com google/i });
    await expect(googleButton).toBeEnabled();

    await googleButton.click();

    await page.waitForURL(
      (url) =>
        url.hostname.includes('supabase.co') ||
        url.hostname.includes('accounts.google.com') ||
        url.toString().includes('/auth/admin/callback'),
      { timeout: 20_000 }
    );

    const currentUrl = page.url();
    expect(
      /supabase\.co|accounts\.google\.com|\/auth\/admin\/callback/.test(currentUrl)
    ).toBeTruthy();
  });
});
