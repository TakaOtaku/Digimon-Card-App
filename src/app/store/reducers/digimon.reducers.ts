import { createReducer, on } from '@ngrx/store';
import * as uuid from 'uuid';
import { IDeck, IDigimonState } from '../../../models';
import {
  addCardToDeck,
  changeFilter,
  changeSort,
  setBlogs,
  setCommunityDecks,
  setCommunityDeckSearch,
  setDeck,
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
};

export const digimonReducer = createReducer(
  initialState,
  on(changeFilter, (state, { filter }) => ({ ...state, filter })),
  on(changeSort, (state, { sort }) => ({ ...state, sort })),
  on(setDeck, (state, { deck }) => ({ ...state, deck })),
  on(setMobileCollectionView, (state, { mobileCollectionView }) => ({
    ...state,
    mobileCollectionView,
  })),
  on(addCardToDeck, (state, { addCardToDeck }) => ({
    ...state,
    addCardToDeck,
  })),
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
  }))
);
