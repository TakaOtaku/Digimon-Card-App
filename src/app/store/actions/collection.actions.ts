import {createAction, props} from '@ngrx/store';

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
