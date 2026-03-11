import { test, expect } from '@playwright/test';
import { ChecklistPage } from './pages/ChecklistPage';

test.describe('Interactive Checklist', () => {
  test('progress persists in localStorage by slug', async ({ page }) => {
    // Navigate to /checklists to find an available checklist
    await page.goto('/checklists');
    await page.waitForLoadState('networkidle');

    const checklistLink = page.locator('a[href*="/checklists/"]').first();
    const linkExists = (await checklistLink.count()) > 0;

    if (!linkExists) {
      test.skip(true, 'No checklists available to test');
      return;
    }

    const href = await checklistLink.getAttribute('href');
    const slug = href?.split('/checklists/')[1]?.split(/[?#]/)[0] ?? '';

    const checklistPage = new ChecklistPage(page);
    await checklistPage.goto(slug);

    // Wait for the client component to load (skeleton disappears)
    await checklistPage.getItemButtons().first().waitFor({ state: 'visible', timeout: 15_000 });

    const totalItems = await checklistPage.getItemCount();
    expect(totalItems).toBeGreaterThan(0);

    // Check the first item
    await checklistPage.toggleItem(0);

    // Verify localStorage was updated
    const storageValue = await page.evaluate((s) => {
      return localStorage.getItem(`checklist:${s}`);
    }, slug);

    expect(storageValue).toBeTruthy();
    const parsed = JSON.parse(storageValue!);
    expect(parsed).toHaveLength(1);

    // Reload the page
    await page.reload();

    // Wait for the client component to load again
    await checklistPage.getItemButtons().first().waitFor({ state: 'visible', timeout: 15_000 });

    // Check that the first item is still checked (aria-pressed="true")
    const firstButton = checklistPage.getItemButtons().first();
    await expect(firstButton).toHaveAttribute('aria-pressed', 'true');

    // Clean up: uncheck the item
    await checklistPage.toggleItem(0);
  });

  test('100% completion shows consultoria CTA', async ({ page }) => {
    await page.goto('/checklists');
    await page.waitForLoadState('networkidle');

    const checklistLink = page.locator('a[href*="/checklists/"]').first();
    const linkExists = (await checklistLink.count()) > 0;

    if (!linkExists) {
      test.skip(true, 'No checklists available to test');
      return;
    }

    const href = await checklistLink.getAttribute('href');
    const slug = href?.split('/checklists/')[1]?.split(/[?#]/)[0] ?? '';

    const checklistPage = new ChecklistPage(page);
    await checklistPage.goto(slug);

    // Wait for client component to load
    await checklistPage.getItemButtons().first().waitFor({ state: 'visible', timeout: 15_000 });

    const totalItems = await checklistPage.getItemCount();

    // Clear any previous progress
    await page.evaluate((s) => {
      localStorage.removeItem(`checklist:${s}`);
    }, slug);
    await page.reload();
    await checklistPage.getItemButtons().first().waitFor({ state: 'visible', timeout: 15_000 });

    // Check all items
    for (let i = 0; i < totalItems; i++) {
      await checklistPage.toggleItem(i);
      // Small delay to let state update
      await page.waitForTimeout(150);
    }

    // The completion CTA should be visible
    await expect(checklistPage.completionBadge).toBeVisible({ timeout: 5_000 });
    await expect(checklistPage.completionCTA).toBeVisible({ timeout: 5_000 });

    // Verify the CTA contains WhatsApp consultoria text
    await expect(
      page.getByText(/Quero Ajuda Personalizada/i)
    ).toBeVisible();

    // Clean up: clear localStorage
    await page.evaluate((s) => {
      localStorage.removeItem(`checklist:${s}`);
    }, slug);
  });
});
