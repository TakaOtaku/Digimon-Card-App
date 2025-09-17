import { CARDSET } from '../enums';
import { ISave, ISettings } from '../interfaces';

export const emptySettings: ISettings = {
  cardSet: CARDSET.English,
  collectionMode: false,
  collectionSets: [],
  collectionMinimum: 1,
  aaCollectionMinimum: 1,

  showNormalCards: false,
  showAACards: false,
  showFoilCards: false,
  showTexturedCards: false,
  showPreRelease: false,
  showBoxTopper: false,
  showFullArtCards: false,
  showStampedCards: false,
  showSpecialRareCards: false,
  showRarePullCards: false,

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
  photoUrl: '',
  displayName: '',
  version: 4.0,
  collection: [],
  decks: [],
  settings: emptySettings,
};
