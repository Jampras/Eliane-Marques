import { type Page, type Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly whatsAppButtons: Locator;

  constructor(page: Page) {
    this.page = page;
    // WhatsApp buttons contain the text "WhatsApp" or the chat icon
    this.whatsAppButtons = page.getByRole('button', { name: /whatsapp/i });
  }

  async goto() {
    await this.page.goto('/');
  }

  async getWhatsAppButtonCount(): Promise<number> {
    return this.whatsAppButtons.count();
  }
}
