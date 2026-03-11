import { type Page, type Locator } from '@playwright/test';

export class ChecklistPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly completionBadge: Locator;
  readonly completionCTA: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { level: 1 });
    this.completionBadge = page.getByText(/Checklist Conclu/i);
    this.completionCTA = page.getByRole('button', { name: /Ajuda Personalizada/i });
  }

  async goto(slug: string) {
    await this.page.goto(`/checklists/${slug}`);
  }

  getItemButtons(): Locator {
    return this.page.locator('button[aria-label^="Marcar item"]');
  }

  async toggleItem(index: number) {
    await this.getItemButtons().nth(index).click();
  }

  async getItemCount(): Promise<number> {
    return this.getItemButtons().count();
  }

  getProgressText(): Locator {
    return this.page.locator('text=/\\d+\\/\\d+/').first();
  }

  async isCompletionCTAVisible(): Promise<boolean> {
    return this.completionBadge.isVisible();
  }
}
