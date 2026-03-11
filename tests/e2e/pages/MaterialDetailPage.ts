import { type Page, type Locator } from '@playwright/test';

export class MaterialDetailPage {
  readonly page: Page;
  readonly productTitle: Locator;
  readonly whatsAppButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productTitle = page.getByRole('heading', { level: 1 });
    this.whatsAppButton = page.getByRole('button', { name: /whatsapp|adquirir/i });
  }

  async goto(slug: string) {
    await this.page.goto(`/materiais/${slug}`);
  }
}
