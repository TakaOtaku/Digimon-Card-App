import { createReducer, on } from '@ngrx/store';
import { DRAG } from 'src/models/enums/drag.enum';
import * as uuid from 'uuid';
import { englishCards } from '../../../assets/cardlists/eng/english';
import { ICountCard, IDeck, IDigimonState } from '../../../models';
import {
  addCardToDeck,
  addCardToSideDeck,
  changeFilter,
  changeSort,
  removeCardFromDeck,
  removeCardFromSideDeck,
  setBlogs,
  setCommunityDecks,
  setCommunityDeckSearch,
  setDeck,
  setDraggedCard,
  setMobileCollectionView,
  setPriceGuideCM,
} from '../digimon.actions';

export const emptyDeck: IDeck = {
  id: uuid.v4(),
  title: '',
  description: '',
  date: new Date().toString(),
  color: { name: 'White', img: 'assets/decks/white.svg' },
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
};

export const initialState: IDigimonState = {
  deck: emptyDeck,
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
  draggedCard: { card: englishCards[0], drag: DRAG.Collection },
};

function checkSpecialCardCounts(card: ICountCard): number {
  if (card!.id.includes('BT6-085') || card!.id.includes('EX2-046') || card!.id.includes('BT11-061')) {
    return card.count > 50 ? 50 : card.count;
  }
  return card.count > 4 ? 4 : card.count;
}

export const digimonReducer = createReducer(
  initialState,
  on(changeFilter, (state, { filter }) => ({ ...state, filter })),
  on(changeSort, (state, { sort }) => ({ ...state, sort })),
  on(setDeck, (state, { deck }) => ({ ...state, deck })),
  on(setMobileCollectionView, (state, { mobileCollectionView }) => ({
    ...state,
    mobileCollectionView,
  })),
  on(addCardToDeck, (state, { addCardToDeck }) => {
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
  on(removeCardFromDeck, (state, { cardId }) => {
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
  on(addCardToSideDeck, (state, { cardId }) => {
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
  on(removeCardFromSideDeck, (state, { cardId }) => {
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
  on(setCommunityDeckSearch, (state, { communityDeckSearch }) => ({
    ...state,
    communityDeckSearch,
  })),
  on(setCommunityDecks, (state, { communityDecks }) => ({
    ...state,
    communityDecks,
  })),
  on(setBlogs, (state, { blogs }) => ({
    ...state,
    blogs,
  })),
  on(setPriceGuideCM, (state, { products }) => ({
    ...state,
    priceGuideCM: products,
  })),
  on(setDraggedCard, (state, { dragCard }) => ({
    ...state,
    draggedCard: dragCard,
  }))
);
