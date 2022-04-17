import {createFeatureSelector, createSelector} from "@ngrx/store";
import {ICard, ICountCard, IDeck, IDigimonCards, IDigimonState, IFilter, ISave, ISettings, ISort} from "../../models";

export const selectIDigimonCards = createFeatureSelector<IDigimonCards>('digimonCards');
export const selectSave = createFeatureSelector<ISave>('save');
export const selectDigimonState = createFeatureSelector<IDigimonState>('digimon');

//region Digimon Selectors
export const selectEdit = createSelector(
  selectDigimonState,
  (state: IDigimonState) => state.edit
);
export const selectSite = createSelector(
  selectDigimonState,
  (state: IDigimonState) => state.site
);
export const selectFilter = createSelector(
  selectDigimonState,
  (state: IDigimonState) => state.filter
);
export const selectSort = createSelector(
  selectDigimonState,
  (state: IDigimonState) => state.sort
);
export const selectDeck = createSelector(
  selectDigimonState,
  (state: IDigimonState) => state.deck
);
//endregion

//region Dialog Selectors
export const selectExportDeckDialog = createSelector(
  selectDigimonState,
  (state: IDigimonState) => state.dialogs.exportDeck
);
export const selectImportDeckDialog = createSelector(
  selectDigimonState,
  (state: IDigimonState) => state.dialogs.importDeck
);
export const selectAccessoryDeckDialog = createSelector(
  selectDigimonState,
  (state: IDigimonState) => state.dialogs.accessoryDeck
);
export const selectViewCardDialog = createSelector(
  selectDigimonState,
  (state: IDigimonState) => state.dialogs.viewCard
);
//endregion

//region Digimon Card Selectors
export const selectAllCards = createSelector(
  selectIDigimonCards,
  (state: IDigimonCards) => state.allCards
);

export const selectFilteredCards = createSelector(
  selectIDigimonCards,
  (state: IDigimonCards) => state.filteredCards
);
//endregion

//region Save Selectors
export const selectCollection = createSelector(
  selectSave,
  (state: ISave) => state.collection
);

export const selectDecks = createSelector(
  selectSave,
  (state: ISave) => state.decks
);

export const selectSettings = createSelector(
  selectSave,
  (state: ISave) => state.settings
);

export const selectCardSize = createSelector(
  selectSettings,
  (state: ISettings) => state.cardSize
);
export const selectCollectionMode = createSelector(
  selectSettings,
  (state: ISettings) => state.collectionMode
);
export const selectCardSet = createSelector(
  selectSettings,
  (state: ISettings) => state.cardSet
);
export const selectCollectionMinimum = createSelector(
  selectSettings,
  (state: ISettings) => state.collectionMinimum
);
export const selectShowPreRelease = createSelector(
  selectSettings,
  (state: ISettings) => state.showPreRelease
);

export const selectShowStampedCards = createSelector(
  selectSettings,
  (state: ISettings) => state.showStampedCards
);
export const selectShowAACards = createSelector(
  selectSettings,
  (state: ISettings) => state.showAACards
);
//endregion

export const selectChangeAdvancedSettings = createSelector(
  selectShowPreRelease,
  selectShowAACards,
  selectShowStampedCards,
  selectFilter,
  (showPreRelease: boolean, showAA: boolean, showStamped: boolean, filter: IFilter) => ({showPreRelease, showAA, showStamped, filter})
);

export const selectChangeFilterEffect = createSelector(
  selectAllCards,
  selectCollection,
  selectFilter,
  selectSort,
  (cards: ICard[], collection: ICountCard[], filter: IFilter, sort: ISort) => ({cards, collection, filter, sort})
);

export const selectDeckBuilderViewModel = createSelector(
  selectDeck,
  selectAllCards,
  selectCollection,
  (deck: IDeck | null, cards: ICard[], collection: ICountCard[]) => ({deck, cards, collection})
);
