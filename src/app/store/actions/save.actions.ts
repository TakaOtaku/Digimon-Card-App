import {createAction, props} from '@ngrx/store';
import {ICollectionCard, IDeck, IFilter, ISave, ISettings, ISort} from "../../models";

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

export const loadSave = createAction(
  '[Digimon Card Save] Load Digimon Card Save',
  props<{ save: ISave }>()
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
  '[Settings] Change Card Size',
  props<{ collectionMode: boolean }>()
);
