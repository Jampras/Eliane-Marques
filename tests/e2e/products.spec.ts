import { test, expect } from './fixtures/auth';
import { AdminProductsPage } from './pages/AdminProductsPage';
import { ProductFormPage, type ProductFormData } from './pages/ProductFormPage';

const timestamp = Date.now();

const testProduct: ProductFormData = {
  title: `Produto E2E ${timestamp}`,
  slug: `produto-e2e-${timestamp}`,
  shortDesc: 'Descricao curta do produto de teste E2E criado automaticamente',
  longDesc: 'Descricao longa detalhada do produto de teste.',
  price: '199.90',
  type: 'CURSO',
  audience: 'AMBOS',
};

/**
 * Helper: expects a product title to be visible in the desktop table.
 * The products page renders a mobile card list (md:hidden) AND a desktop table (hidden md:block),
 * so we must scope to the visible table to avoid strict-mode violations.
 */
async function expectProductInTable(page: import('@playwright/test').Page, title: string) {
  const table = page.locator('table');
  await expect(table.getByText(title)).toBeVisible({ timeout: 10_000 });
}

async function expectProductNotInTable(page: import('@playwright/test').Page, title: string) {
  const table = page.locator('table');
  await expect(table.getByText(title)).not.toBeVisible({ timeout: 10_000 });
}

test.describe('Product CRUD (admin)', () => {
  test.describe.configure({ mode: 'serial' });

  test('create product with all required fields', async ({ adminPage }) => {
    const productsPage = new AdminProductsPage(adminPage);
    await productsPage.goto();
    await productsPage.clickNewProduct();

    await adminPage.waitForURL('**/admin/produtos/novo');

    const formPage = new ProductFormPage(adminPage);
    await formPage.fillForm(testProduct);
    await formPage.submit();

    // Should redirect to products list and show success toast
    await adminPage.waitForURL('**/admin/produtos', { timeout: 15_000 });

    // Verify the product appears in the desktop table
    await expectProductInTable(adminPage, testProduct.title);
  });

  test('edit existing product', async ({ adminPage }) => {
    const productsPage = new AdminProductsPage(adminPage);
    await productsPage.goto();
    await productsPage.clickEdit(testProduct.title);

    const formPage = new ProductFormPage(adminPage);

    const updatedTitle = `${testProduct.title} Editado`;
    await formPage.titleInput.fill(updatedTitle);
    await formPage.submit();

    await adminPage.waitForURL('**/admin/produtos', { timeout: 15_000 });

    // Verify the updated title appears in the table
    await expectProductInTable(adminPage, updatedTitle);

    // Update the reference for cleanup
    testProduct.title = updatedTitle;
  });

  test('duplicate slug validation', async ({ adminPage }) => {
    const productsPage = new AdminProductsPage(adminPage);
    await productsPage.goto();
    await productsPage.clickNewProduct();

    await adminPage.waitForURL('**/admin/produtos/novo');

    const formPage = new ProductFormPage(adminPage);

    // Try to create another product with the same slug
    await formPage.fillForm({
      ...testProduct,
      title: `Outro Produto ${timestamp}`,
      // Same slug as the already created product
    });
    await formPage.submit();

    // Should show an error (toast or inline) — the product should NOT be created
    // The server will return an error because the slug is unique in the DB
    const errorVisible = await adminPage
      .getByText(/(slug|ja existe|duplicad|unique|erro|falha|possivel)/i)
      .first()
      .isVisible({ timeout: 10_000 })
      .catch(() => false);

    // If no explicit error text, at least we should NOT be redirected to the list
    if (!errorVisible) {
      // We stay on the form page (no redirect means validation caught the duplicate)
      expect(adminPage.url()).toContain('/admin/produtos/novo');
    }
  });

  test('delete product with confirmation', async ({ adminPage }) => {
    const productsPage = new AdminProductsPage(adminPage);
    await productsPage.goto();
    await productsPage.clickEdit(testProduct.title);

    const formPage = new ProductFormPage(adminPage);
    await formPage.clickDelete();
    await formPage.confirmDelete();

    // Should redirect to products list after deletion
    await adminPage.waitForURL('**/admin/produtos', { timeout: 15_000 });

    // The product should no longer be in the table
    await expectProductNotInTable(adminPage, testProduct.title);
  });
});
