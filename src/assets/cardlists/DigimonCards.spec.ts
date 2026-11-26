import { CARDSET } from '@models';
import { setupDigimonCards } from './DigimonCards';

const card = (id: string, cardNumber = id, japanese = 'Valid') => ({ id, cardNumber, name: { japanese } });

/** Answers every card file with its own list; a list that is not given is a missing file. */
function serve(files: Record<string, object[]>) {
  return jest.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
    const list = files[String(url).replace('assets/cardlists/', '')];
    return list ? new Response(JSON.stringify(list), { status: 200 }) : new Response('', { status: 404 });
  });
}

describe('setupDigimonCards', () => {
  afterEach(() => jest.restoreAllMocks());

  it.each([CARDSET.English, CARDSET.Japanese])('excludes ST25-15 and its prints in %s', async (cardset) => {
    const suffix = cardset === CARDSET.English ? 'ENG' : 'JAP';
    serve({
      [`PreparedDigimonCards${suffix}.json`]: [card('ST25-15'), card('ST25-15_P1', 'ST25-15'), card('ST25-14')],
      [`PreparedAlysionCards${suffix}.json`]: [],
    });

    expect((await setupDigimonCards(cardset)).map((c) => c.id)).toEqual(['ST25-14']);
  });

  it('merges the normal and the Alysion cards of the language', async () => {
    serve({ 'PreparedDigimonCardsENG.json': [card('BT1-001')], 'PreparedAlysionCardsENG.json': [card('BD01-01')] });
    expect((await setupDigimonCards(CARDSET.English)).map((c) => c.id)).toEqual(['BT1-001', 'BD01-01']);
  });

  it('keeps the normal cards when the Alysion file cannot be loaded', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    serve({ 'PreparedDigimonCardsENG.json': [card('BT1-001')] });
    expect((await setupDigimonCards(CARDSET.English)).map((c) => c.id)).toEqual(['BT1-001']);
  });

  it('fails when the normal cards cannot be loaded', async () => {
    serve({ 'PreparedAlysionCardsENG.json': [card('BD01-01')] });
    await expect(setupDigimonCards(CARDSET.English)).rejects.toThrow('PreparedDigimonCardsENG.json');
  });
});
