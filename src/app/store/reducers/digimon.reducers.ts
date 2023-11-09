import { createReducer, on } from '@ngrx/store';
import { DRAG } from 'src/models/enums/drag.enum';
import * as uuid from 'uuid';
import { DigimonCard, ICountCard, IDeck, IDigimonState } from '../../../models';
import { WebsiteActions } from '../digimon.actions';

export const dummyCard: DigimonCard = {
  aceEffect: '-',
  attribute: '-',
  block: ['00'],
  burstDigivolve: '-',
  cardImage: 'assets/images/cards/BT1-001.webp',
  cardLv: 'Lv.2',
  cardNumber: 'BT1-001',
  cardType: 'Digi-Egg',
  color: 'Red',
  digiXros: '-',
  digivolveCondition: [],
  digivolveEffect:
    "[When Attacking] When you attack an opponent's Digimon, this Digimon gets +1000 DP for the turn.",
  dnaDigivolve: '-',
  dp: '-',
  effect: '-',
  form: 'In-Training',
  id: 'BT1-001',
  illustrator: 'TANIMESO',
  name: {
    english: 'Yokomon',
    japanese: '\u30d4\u30e7\u30b3\u30e2\u30f3',
    korean: '\uc5b4\ub2c8\ubaac',
    simplifiedChinese: '\u6bd4\u9ad8\u517d',
    traditionalChinese: '\u6bd4\u9ad8\u7378',
  },
  notes: 'BT-01: Booster New Evolution',
  playCost: '-',
  rarity: 'R',
  restrictions: {
    chinese: 'Unrestricted',
    english: 'Unrestricted',
    japanese: 'Unrestricted',
    korean: 'Unrestricted',
  },
  securityEffect: '-',
  specialDigivolve: '-',
  type: 'Digimon',
  version: 'Normal',
};

export const emptyDeck: IDeck = {
  id: uuid.v4(),
  title: '',
  description: '',
  date: new Date().toString(),
  color: { name: 'White', img: 'assets/images/decks/white.svg' },
  cards: [],
  sideDeck: [],
  tags: [],
  user: '',
  userId: '',
  imageCardId: 'BT1-001',
  likes: [],
};

export const emptyFilter = {
  searchFilter: '',
  setFilter: [],
  cardCountFilter: [0, 5],
  levelFilter: [2, 7],
  playCostFilter: [0, 20],
  digivolutionFilter: [0, 7],
  dpFilter: [1, 17],
  rarityFilter: [],
  versionFilter: [],
  keywordFilter: [],
  formFilter: [],
  attributeFilter: [],
  typeFilter: [],
  colorFilter: [],
  cardTypeFilter: [],
  illustratorFilter: [],
  specialRequirementsFilter: [],
  blockFilter: [],
  restrictionsFilter: [],
  sourceFilter: [],
  presetFilter: [],
};

export const initialState: IDigimonState = {
  deck: JSON.parse(JSON.stringify(emptyDeck)),
  filter: emptyFilter,
  mobileCollectionView: false,
  addCardToDeck: '',
  sort: {
    sortBy: {
      name: 'ID',
      element: 'id',
    },
    ascOrder: true,
  },
  communityDeckSearch: '',
  communityDecks: [],
  blogs: [],
  priceGuideCM: [],
  draggedCard: {
    card: JSON.parse(JSON.stringify(dummyCard)),
    drag: DRAG.Collection,
  },
};

function checkSpecialCardCounts(card: ICountCard): number {
  if (
    card!.id.includes('BT6-085') ||
    card!.id.includes('EX2-046') ||
    card!.id.includes('BT11-061')
  ) {
    return card.count > 50 ? 50 : card.count;
  }
  return card.count > 4 ? 4 : card.count;
}

export const digimonReducer = createReducer(
  initialState,
  on(WebsiteActions.setfilter, (state, { filter }) => ({ ...state, filter })),
  on(WebsiteActions.setsearchfilter, (state, { search }) => ({
    ...state,
    filter: { ...state.filter, searchFilter: search },
  })),
  on(WebsiteActions.setcolorfilter, (state, { colorFilter }) => ({
    ...state,
    filter: { ...state.filter, colorFilter },
  })),
  on(WebsiteActions.setcardtypefilter, (state, { cardTypeFilter }) => ({
    ...state,
    filter: { ...state.filter, cardTypeFilter },
  })),
  on(WebsiteActions.setblockfilter, (state, { blockFilter }) => ({
    ...state,
    filter: { ...state.filter, blockFilter },
  })),
  on(WebsiteActions.setrarityfilter, (state, { rarityFilter }) => ({
    ...state,
    filter: { ...state.filter, rarityFilter },
  })),
  on(WebsiteActions.setversionfilter, (state, { versionFilter }) => ({
    ...state,
    filter: { ...state.filter, versionFilter },
  })),
  on(WebsiteActions.setsetfilter, (state, { setFilter }) => ({
    ...state,
    filter: { ...state.filter, setFilter },
  })),
  on(WebsiteActions.setsort, (state, { sort }) => ({ ...state, sort })),
  on(WebsiteActions.setdeck, (state, { deck }) => {
    return { ...state, deck };
  }),
  on(WebsiteActions.createnewdeck, (state, { uuid }) => {
    const deck = {
      id: uuid,
      title: '',
      description: '',
      date: new Date().toString(),
      color: { name: 'White', img: 'assets/images/decks/white.svg' },
      cards: [],
      sideDeck: [],
      tags: [],
      user: '',
      userId: '',
      imageCardId: 'BT1-001',
      likes: [],
    };
    return { ...state, deck };
  }),
  on(
    WebsiteActions.setmobilecollectionview,
    (state, { mobileCollectionView }) => ({
      ...state,
      mobileCollectionView,
    })
  ),
  on(WebsiteActions.addcardtodeck, (state, { addCardToDeck }) => {
    const cards = state.deck.cards.map((card) => {
      if (card.id === addCardToDeck) {
        card.count += 1;
      }

      card.count = checkSpecialCardCounts(card);
      return card;
    });

    if (!cards.find((card) => card.id === addCardToDeck)) {
      cards.push({ id: addCardToDeck, count: 1 });
    }

    return {
      ...state,
      deck: { ...state.deck, cards },
    };
  }),
  on(WebsiteActions.removecardfromdeck, (state, { cardId }) => {
    const cards = state.deck.cards
      .map((card) => {
        if (card.id === cardId) {
          card.count -= 1;
        }
        return card;
      })
      .filter((card) => card.count > 0);

    return {
      ...state,
      deck: { ...state.deck, cards },
    };
  }),
  on(WebsiteActions.addcardtosidedeck, (state, { cardId }) => {
    const sideDeck = (state.deck.sideDeck ?? []).map((card) => {
      if (card.id === cardId) {
        card.count += 1;
      }

      card.count = checkSpecialCardCounts(card);
      return card;
    });

    if (!sideDeck.find((card) => card.id === cardId)) {
      sideDeck.push({ id: cardId, count: 1 });
    }

    return {
      ...state,
      deck: { ...state.deck, sideDeck },
    };
  }),
  on(WebsiteActions.removecardfromsidedeck, (state, { cardId }) => {
    const sideDeck = (state.deck.sideDeck ?? [])
      .map((card) => {
        if (card.id === cardId) {
          card.count -= 1;
        }
        return card;
      })
      .filter((card) => card.count > 0);

    return {
      ...state,
      deck: { ...state.deck, sideDeck },
    };
  }),
  on(
    WebsiteActions.setcommunitydecksearch,
    (state, { communityDeckSearch }) => ({
      ...state,
      communityDeckSearch,
    })
  ),
  on(WebsiteActions.setcommunitydecks, (state, { communityDecks }) => ({
    ...state,
    communityDecks,
  })),
  on(WebsiteActions.setblogs, (state, { blogs }) => ({
    ...state,
    blogs,
  })),
  on(WebsiteActions.setpriceguidecm, (state, { products }) => ({
    ...state,
    priceGuideCM: products,
  })),
  on(WebsiteActions.setdraggedcard, (state, { dragCard }) => ({
    ...state,
    draggedCard: dragCard,
  }))
);
