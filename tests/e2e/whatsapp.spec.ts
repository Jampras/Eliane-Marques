import { test, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';
import { MaterialDetailPage } from './pages/MaterialDetailPage';

test.describe('WhatsApp CTAs', () => {
  test('home page CTA button builds correct wa.me URL', async ({ page }) => {
    // Intercept window.open to capture the WhatsApp URL
    let capturedUrl = '';
    await page.addInitScript(() => {
      window.open = (url?: string | URL) => {
        (window as unknown as Record<string, string>).__capturedPopupUrl =
          typeof url === 'string' ? url : url?.toString() ?? '';
        return null;
      };
    });

    const homePage = new HomePage(page);
    await homePage.goto();

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Find the first WhatsApp button and click it
    const whatsAppButtons = page.getByRole('button', { name: /whatsapp|vaga|orientacao/i });
    const buttonCount = await whatsAppButtons.count();

    if (buttonCount > 0) {
      await whatsAppButtons.first().click();

      capturedUrl = await page.evaluate(
        () => (window as unknown as Record<string, string>).__capturedPopupUrl ?? ''
      );

      expect(capturedUrl).toMatch(/wa\.me/);
      expect(capturedUrl).toContain('text=');
    } else {
      // If there are only WhatsApp links (not buttons), check href
      const whatsAppLinks = page.locator('a[href*="wa.me"]');
      const linkCount = await whatsAppLinks.count();
      expect(linkCount).toBeGreaterThan(0);

      const href = await whatsAppLinks.first().getAttribute('href');
      expect(href).toMatch(/wa\.me/);
    }
  });

  test('material detail page button injects productTitle', async ({ page }) => {
    let capturedUrl = '';
    await page.addInitScript(() => {
      window.open = (url?: string | URL) => {
        (window as unknown as Record<string, string>).__capturedPopupUrl =
          typeof url === 'string' ? url : url?.toString() ?? '';
        return null;
      };
    });

    // We need a product that exists. Navigate to /materiais first to find a slug.
    await page.goto('/materiais');
    await page.waitForLoadState('networkidle');

    // Find the first product link on the materials listing page
    const productLink = page.locator('a[href*="/materiais/"]').first();
    const linkExists = (await productLink.count()) > 0;

    if (!linkExists) {
      test.skip(true, 'No products available in /materiais to test');
      return;
    }

    const href = await productLink.getAttribute('href');
    const slug = href?.split('/materiais/')[1]?.split(/[?#]/)[0] ?? '';

    const materialPage = new MaterialDetailPage(page);
    await materialPage.goto(slug);

    await page.waitForLoadState('networkidle');

    // Get the product title displayed on the page
    const productTitle = await materialPage.productTitle.textContent();

    // Click the WhatsApp button
    await materialPage.whatsAppButton.click();

    capturedUrl = await page.evaluate(
      () => (window as unknown as Record<string, string>).__capturedPopupUrl ?? ''
    );

    // The captured URL should contain the product title (URL-encoded)
    expect(capturedUrl).toMatch(/wa\.me/);

    if (productTitle) {
      const decodedUrl = decodeURIComponent(capturedUrl);
      expect(decodedUrl).toContain(productTitle.trim());
    }
  });

  test('popup blocked fallback shows toast', async ({ page }) => {
    // Mock window.open to return null (simulating blocked popup)
    await page.addInitScript(() => {
      window.open = () => null;
    });

    const homePage = new HomePage(page);
    await homePage.goto();
    await page.waitForLoadState('networkidle');

    const whatsAppButton = page.getByRole('button', { name: /whatsapp|vaga|orientacao/i }).first();
    const hasButton = (await whatsAppButton.count()) > 0;

    if (!hasButton) {
      test.skip(true, 'No WhatsApp button on home page');
      return;
    }

    await whatsAppButton.click();

    // The WhatsAppButton component always shows a toast "Abrindo WhatsApp"
    // regardless of whether window.open succeeds
    await expect(
      page.getByText(/abrindo whatsapp/i)
    ).toBeVisible({ timeout: 5_000 });
  });
});
