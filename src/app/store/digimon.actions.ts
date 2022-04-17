import {createAction, props} from '@ngrx/store';
import {ICard, ICountCard, IDeck, IFilter, ISave, ISettings, ISort} from "../../models";

//region Digimon Card Actions
export const setDigimonCards = createAction(
  '[Digimon Cards] Set Digimon Cards',
  props<{ digimonCards: ICard[] }>()
);
export const setFilteredDigimonCards = createAction(
  '[Digimon Cards] Set Filtered Digimon Cards',
  props<{ filteredCards: ICard[] }>()
);
//endregion

//region Website Actions
export const setDeck = createAction(
  '[Set Deck] Set current Deck',
  props<{ deck: IDeck }>()
);

export const setEdit = createAction(
  '[Set Edit] Set Edit View',
  props<{ edit: boolean }>()
);

export const setSite = createAction(
  '[Set Site] Set current Site',
  props<{ site: number }>()
);

export const changeFilter = createAction(
  '[Settings] Change Filter',
  props<{ filter: IFilter }>()
);

export const changeSort = createAction(
  '[Settings] Change Sort',
  props<{ sort: ISort }>()
);

export const changeCollectionMinimum = createAction(
  '[Settings] Change Collection Minimum',
  props<{ minimum: number }>()
);

export const changeShowVersion = createAction(
  '[Settings] Change Show Version',
  props<{ showPre: boolean, showAA: boolean, showStamp: boolean }>()
);
//endregion

//region Dialog Actions
export const setExportDeckDialog = createAction(
  '[Show Export Deck Dialog] Set Export Deck Dialog',
  props<{ show: boolean, deck: IDeck }>()
);
export const setImportDeckDialog = createAction(
  '[Set Import Deck Dialog] Set Import Deck Dialog',
  props<{ show: boolean }>()
);
export const setAccessoryDeckDialog = createAction(
  '[Set Accessory Deck Dialog] Set Accessory Deck Dialog',
  props<{ show: boolean, deck: IDeck }>()
);
export const setViewCardDialog = createAction(
  '[Set View Card Dialog] Set View Card Dialog',
  props<{ show: boolean, card: ICard }>()
);
//endregion

//region Save Actions
export const loadSave = createAction(
  '[Digimon Card Save] Load Digimon Card Save',
  props<{ save: ISave }>()
);
export const setSave = createAction(
  '[Digimon Card Save] Set Digimon Card Save',
  props<{ save: ISave }>()
);
export const setCollection = createAction(
  '[Digimon Card Save] Set Digimon Card Collection',
  props<{ collection: ICountCard[] }>()
);
export const setDecks = createAction(
  '[Digimon Card Save] Set Digimon Card Decks',
  props<{ decks: IDeck[] }>()
);
export const setSettings = createAction(
  '[Digimon Card Save] Set Digimon Card Settings',
  props<{ settings: ISettings }>()
);
export const changeCardSize = createAction(
  '[Settings] Change Card Size',
  props<{ cardSize: number }>()
);

export const changeCollectionMode = createAction(
  '[Settings] Change Collection Mode',
  props<{ collectionMode: boolean }>()
);
export const changeCardSets = createAction(
  '[Settings] Change Card Sets',
  props<{ cardSet: number }>()
);
//endregion

//region Collection Actions
export const addToCollection = createAction(
  '[Digimon Cards Collection] Add Digimon Cards to Collection',
  props<{ collectionCards: ICountCard[] }>()
);

export const changeCardCount = createAction(
  '[Digimon Cards] Change Digimon Card Count',
  props<{ id: string, count: number }>()
);
//endregion

//region Deck Actions
export const importDeck = createAction(
  '[Digimon Deck] Import Digimon Deck',
  props<{ deck: IDeck }>()
);

export const deleteDeck = createAction(
  '[Digimon Deck] Delete Digimon Deck',
  props<{ deck: IDeck }>()
);

export const changeDeck = createAction(
  '[Digimon Deck] Change Digimon Deck',
  props<{ deck: IDeck }>()
);

export const addToDeck = createAction(
  '[Digimon Deck] Add a Digimon Card',
  props<{ card: ICountCard }>()
);
//endregion



