import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('**/api/**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  );
});

test('shows stats beside the builder and keeps filters in the drawer', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto('/deckbuilder');

  await expect(page.getByRole('group', { name: 'Pinned builder panel' })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Deck stats' })).toBeVisible();
  await page.locator('digimon-pagination-card-list-header').getByRole('button', { name: 'Filter' }).click();
  const filter = page.locator('digimon-filter-side-box:visible');
  const egg = filter.getByRole('button', { name: 'Digi-Egg', exact: true });
  await expect(egg).toBeVisible();
  expect(await egg.evaluate((element) => element.scrollWidth <= element.clientWidth && element.scrollHeight <= element.clientHeight)).toBe(true);
  await egg.click();
  await expect(egg).toHaveAttribute('aria-pressed', 'true');

  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Hide deck stats' }).click();
  await page.getByRole('button', { name: 'Show deck stats' }).click();
  await expect(page.getByRole('heading', { name: 'Deck stats' })).toBeVisible();
  await page.locator('digimon-pagination-card-list-header').getByRole('button', { name: 'Filter' }).click();
  await expect(page.locator('digimon-filter-side-box:visible').getByRole('button', { name: 'Digi-Egg', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Escape');
});

test('preserves saved references to the excluded card when using the builder', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/deckbuilder');
  await expect.poll(async () => page.evaluate(() => localStorage.getItem('Digimon-Card-Collector'))).not.toBeNull();
  await page.evaluate(() => {
    const save = JSON.parse(localStorage.getItem('Digimon-Card-Collector')!);
    save.collection = [{ id: 'ST25-15', count: 1 }];
    save.decks = [{
      id: 'saved-deck', title: 'Saved deck', description: '', cards: [{ id: 'ST25-15_P1', count: 1 }],
      sideDeck: [], color: {}, tags: [], date: '', user: '', userId: '', imageCardId: '', likes: [],
    }];
    localStorage.setItem('Digimon-Card-Collector', JSON.stringify(save));
  });
  await page.reload();
  await page.getByRole('button', { name: 'Hide deck stats' }).click();
  await page.getByRole('button', { name: 'Show deck stats' }).click();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('Digimon-Card-Collector')!));
  expect(saved.collection).toEqual([{ id: 'ST25-15', count: 1 }]);
  expect(saved.decks[0].cards).toEqual([{ id: 'ST25-15_P1', count: 1 }]);
});

test('preserves unavailable cards when a deck is edited and saved', async ({ page }) => {
  const deck = {
    id: 'preserved', title: 'Preserved deck', description: '',
    cards: [{ id: 'ST25-15_P1', count: 1 }, { id: 'BT1-001', count: 2 }],
    sideDeck: [{ id: 'ST25-15', count: 1 }], color: { name: '', img: '' }, tags: [],
    date: '', user: '', userId: '', imageCardId: '', likes: [],
  };
  await page.route('**/api/decks/preserved', (route) => route.fulfill({ json: deck }));
  await page.goto('/deckbuilder/preserved');
  await expect(page.getByRole('textbox', { name: 'Deck name' })).toHaveValue('Preserved deck');
  await page.getByRole('button', { name: /Save/ }).first().click();
  await page.getByRole('button', { name: 'Yes' }).click();
  await expect.poll(async () => page.evaluate(() => JSON.parse(localStorage.getItem('Digimon-Card-Collector') || '{}').decks?.length)).toBeGreaterThan(0);
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('Digimon-Card-Collector')!).decks[0]);
  expect(saved.cards).toEqual(expect.arrayContaining(deck.cards));
  expect(saved.sideDeck).toEqual(deck.sideDeck);
});

test('keeps mobile builder tabs and filter drawer usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/deckbuilder');
  await page.getByRole('tab', { name: 'Pool' }).click();
  await page.locator('digimon-pagination-card-list-header').getByRole('button', { name: 'Filter' }).click();
  const egg = page.locator('digimon-filter-side-box:visible').getByRole('button', { name: 'Digi-Egg', exact: true });
  await expect(egg).toBeVisible();
  expect(await egg.evaluate((element) => element.scrollWidth <= element.clientWidth && element.scrollHeight <= element.clientHeight)).toBe(true);
  await page.keyboard.press('Escape');
  await page.getByRole('tab', { name: 'Stats' }).click();
  await expect(page.getByRole('tab', { name: 'Stats' })).toHaveAttribute('aria-selected', 'true');
});
