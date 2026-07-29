import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('**/api/**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  );
});

test.describe('Navigation', () => {
  test('navigates to the deckbuilder route', async ({ page }) => {
    await page.goto('/deckbuilder');
    await expect(page).toHaveURL(/deckbuilder/);
    await expect(page.locator('img[alt="Logo"]')).toBeVisible();
  });

  test('navigates to the decks route', async ({ page }) => {
    await page.goto('/decks');
    await expect(page).toHaveURL(/decks/);
    await expect(page.locator('img[alt="Logo"]')).toBeVisible();
  });
});
