import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

type Dialog = {
  settings: boolean;
};

const initialState: Dialog = {
  settings: false,
};

export const DialogStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withMethods((store) => ({
    updateSettingsDialog(settings: boolean): void {
      patchState(store, (state) => ({ settings }));
    },
  })),
);
