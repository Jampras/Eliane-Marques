import { type Page, type Locator } from '@playwright/test';

export class AdminLoginPage {
  readonly page: Page;
  readonly passwordInput: Locator;
  readonly passwordButton: Locator;
  readonly googleButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.passwordInput = page.locator('input[name="password"]');
    this.passwordButton = page.getByRole('button', { name: /entrar com senha/i });
    this.googleButton = page.getByRole('button', { name: /entrar com google/i });
    this.errorMessage = page.locator('[class*="red-500"]').filter({ hasText: /.+/ });
  }

  async goto() {
    await this.page.goto('/admin/login');
  }

  async login(password: string) {
    await this.passwordInput.fill(password);
    await this.passwordButton.click();
  }

  async getError(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible', timeout: 10_000 });
    return (await this.errorMessage.textContent()) ?? '';
  }
}
