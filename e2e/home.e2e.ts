import { expect, test } from '@playwright/test';

/**
 * Stub the backend API so the UI renders deterministically without a running
 * backend. Individual tests can override specific routes as needed.
 */
test.beforeEach(async ({ page }) => {
  await page.route('**/api/**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  );
});

test.describe('Home page', () => {
  test('loads and shows the navbar logo', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('img[alt="Logo"]')).toBeVisible();
  });

  test('logo links somewhere (configured app URL)', async ({ page }) => {
    await page.goto('/');
    const logoLink = page.locator('a:has(img[alt="Logo"])').first();
    await expect(logoLink).toHaveAttribute('href', /.+/);
  });

  test('has no uncaught page errors on load', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(errors).toEqual([]);
  });
});
