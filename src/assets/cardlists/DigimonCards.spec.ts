import { CARDSET } from '@models';
import { setupDigimonCards } from './DigimonCards';

describe('setupDigimonCards', () => {
  afterEach(() => jest.restoreAllMocks());

  it.each([CARDSET.English, CARDSET.Japanese])('excludes ST25-15 and its prints in %s', async (cardset) => {
    const cards = [
      { id: 'ST25-15', cardNumber: 'ST25-15', name: { japanese: 'Invalid' } },
      { id: 'ST25-15_P1', cardNumber: 'ST25-15', name: { japanese: 'Invalid print' } },
      { id: 'ST25-14', cardNumber: 'ST25-14', name: { japanese: 'Valid' } },
    ];
    jest.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify(cards), { status: 200 }));

    expect((await setupDigimonCards(cardset)).map((card) => card.id)).toEqual(['ST25-14']);
  });
});
