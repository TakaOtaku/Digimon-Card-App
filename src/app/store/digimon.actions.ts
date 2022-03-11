import {createAction, props} from '@ngrx/store';
import {ICard, ICollectionCard, IDeck, ISave, ISettings} from "../models";
import {IFilter, ISort} from "../models/digimon-state.interface";

//region Digimon Card Actions
export const setDigimonCards = createAction(
  '[Digimon Cards] Set all Digimon Cards',
  props<{ allCards: ICard[] }>()
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

export const changeCardSize = createAction(
  '[Settings] Change Card Size',
  props<{ cardSize: number }>()
);

export const changeCollectionMode = createAction(
  '[Settings] Change Collection Mode',
  props<{ collectionMode: boolean }>()
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
  props<{ collection: ICollectionCard[] }>()
);
export const setDecks = createAction(
  '[Digimon Card Save] Set Digimon Card Decks',
  props<{ decks: IDeck[] }>()
);
export const setSettings = createAction(
  '[Digimon Card Save] Set Digimon Card Settings',
  props<{ settings: ISettings }>()
);
//endregion

//region Collection Actions
export const addToCollection = createAction(
  '[Digimon Cards Collection] Add Digimon Cards to Collection',
  props<{ collectionCards: ICollectionCard[] }>()
);

export const changeCardCount = createAction(
  '[Digimon Cards] Change Digimon Card Count',
  props<{ id: string, count: number }>()
);

export const increaseCardCount = createAction(
  '[Digimon Cards] Increase Digimon Card Count',
  props<{ id: string }>()
);

export const decreaseCardCount = createAction(
  '[Digimon Cards] Decreased Digimon Card Count',
  props<{ id: string }>()
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
//endregion



