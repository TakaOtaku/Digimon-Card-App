import { CARDSET } from '../enums';
import { ISave, ISettings } from '../interfaces';

export const emptySettings: ISettings = {
  cardSet: CARDSET.English,
  collectionMode: false,
  collectionSets: [],
  collectionMinimum: 1,
  aaCollectionMinimum: 1,

  showFoilCards: true,
  showTexturedCards: true,
  showPreRelease: true,
  showBoxTopper: true,
  showFullArtCards: true,
  showStampedCards: true,
  showAACards: true,
  showReprintCards: false,

  sortDeckOrder: 'Level',

  showUserStats: true,

  deckDisplayTable: false,
  displaySideDeck: true,

  fullscreenFilter: true,
  countMax: 5,
};

export const emptySave: ISave = {
  uid: '',
  photoURL: '',
  displayName: '',
  version: 4.0,
  collection: [],
  decks: [],
  settings: emptySettings,
};
