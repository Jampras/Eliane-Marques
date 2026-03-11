import { type Page, type Locator } from '@playwright/test';

export class AdminProductsPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly newProductLink: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /Gestão de Produtos/i });
    this.newProductLink = page.getByRole('link', { name: /Novo Produto/i });
    this.emptyState = page.getByText('Nenhum produto cadastrado.');
  }

  async goto() {
    await this.page.goto('/admin/produtos');
  }

  async clickNewProduct() {
    await this.newProductLink.click();
  }

  async clickEdit(title: string) {
    // On desktop, find the row containing the title and click its "Editar" link
    const row = this.page.locator('tr', { hasText: title });
    await row.getByRole('link', { name: /Editar/i }).click();
  }

  async hasProduct(title: string): Promise<boolean> {
    return this.page.getByText(title, { exact: false }).isVisible();
  }
}
