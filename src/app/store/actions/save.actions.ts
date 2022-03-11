import {createAction, props} from '@ngrx/store';
import {ICollectionCard, IDeck, IFilter, ISave, ISettings, ISort} from "../../models";

//region Set Actions
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

//region Load Actions
export const loadSave = createAction(
  '[Digimon Card Save] Load Digimon Card Save',
  props<{ save: ISave }>()
);
//endregion

//region Change Actions
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
  '[Settings] Change Card Size',
  props<{ collectionMode: boolean }>()
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

//region Collection Actions
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
