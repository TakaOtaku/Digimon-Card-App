import { dummyCard, emptyFilter, emptySave, Forms } from '@models';
import { filterCards } from './filter.functions';

describe('Appmon form filtering', () => {
  const forms = ['Appmon', 'Stnd./Appmon', 'Sup./Appmon', 'Ult./Appmon', 'God/Appmon'];
  const cards = forms.map((form, index) => ({ ...dummyCard, id: `TEST-${index}`, form }));
  const sort = { ascOrder: true, sortBy: { name: 'ID', element: 'id' } };

  it.each(forms)('selects cards with the exact %s form', (form) => {
    expect(Forms).toContain(form);
    expect(filterCards(cards, emptySave, { ...emptyFilter, formFilter: [form] }, sort, new Map()).map((card) => card.form)).toEqual([form]);
  });
});
