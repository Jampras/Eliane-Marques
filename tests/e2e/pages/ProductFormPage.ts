import { type Page, type Locator } from '@playwright/test';

export interface ProductFormData {
  title: string;
  slug: string;
  shortDesc: string;
  longDesc?: string;
  price: string;
  type?: string;
  audience?: string;
  coverImage?: string;
  active?: boolean;
}

export class ProductFormPage {
  readonly page: Page;
  readonly titleInput: Locator;
  readonly slugInput: Locator;
  readonly shortDescInput: Locator;
  readonly longDescInput: Locator;
  readonly priceInput: Locator;
  readonly typeSelect: Locator;
  readonly audienceSelect: Locator;
  readonly coverImageInput: Locator;
  readonly activeCheckbox: Locator;
  readonly saveButton: Locator;
  readonly deleteButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.titleInput = page.locator('input[name="title"]');
    this.slugInput = page.locator('input[name="slug"]');
    this.shortDescInput = page.locator('input[name="shortDesc"]');
    this.longDescInput = page.locator('textarea[name="longDesc"]');
    this.priceInput = page.locator('input[name="price"]');
    this.typeSelect = page.locator('select[name="type"]');
    this.audienceSelect = page.locator('select[name="audience"]');
    this.coverImageInput = page.locator('input[name="coverImage"]');
    this.activeCheckbox = page.locator('input[name="active"]');
    this.saveButton = page.getByRole('button', { name: /Salvar/i });
    this.deleteButton = page.getByRole('button', { name: /Excluir Produto/i });
  }

  async fillForm(data: ProductFormData) {
    await this.titleInput.fill(data.title);
    await this.slugInput.fill(data.slug);
    await this.shortDescInput.fill(data.shortDesc);

    if (data.longDesc) {
      await this.longDescInput.fill(data.longDesc);
    }

    await this.priceInput.fill(data.price);

    if (data.type) {
      await this.typeSelect.selectOption(data.type);
    }

    if (data.audience) {
      await this.audienceSelect.selectOption(data.audience);
    }

    if (data.coverImage) {
      await this.coverImageInput.fill(data.coverImage);
    }
  }

  async submit() {
    await this.saveButton.click();
  }

  async clickDelete() {
    await this.deleteButton.click();
  }

  async confirmDelete() {
    // After clicking delete, a "Confirmar?" UI appears with "Sim" and "Nao" buttons
    await this.page.getByRole('button', { name: 'Sim' }).click();
  }

  async getToastText(): Promise<string> {
    // The toast component renders text visible on screen
    const toast = this.page.locator('[role="status"], [data-toast]').first();
    try {
      await toast.waitFor({ state: 'visible', timeout: 10_000 });
      return (await toast.textContent()) ?? '';
    } catch {
      // Fallback: look for any toast-like element
      const fallback = this.page.getByText(/Produto (criado|atualizado|excluido)/i).first();
      await fallback.waitFor({ state: 'visible', timeout: 5_000 });
      return (await fallback.textContent()) ?? '';
    }
  }
}
