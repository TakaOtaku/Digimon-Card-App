import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { DigimonCard, dummyCard, emptyDeck, IDeck } from '../../models';

interface ExportDeckDialog {
  show: boolean;
  deck: IDeck;
}

interface ViewCardDialog {
  show: boolean;
  card: DigimonCard;
  width: string;
}

type Dialog = {
  settings: boolean;
  viewCard: ViewCardDialog;
  exportDeck: ExportDeckDialog;
};

const initialState: Dialog = {
  settings: false,
  viewCard: {
    show: false,
    card: JSON.parse(JSON.stringify(dummyCard)),
    width: '50vw',
  },
  exportDeck: {
    show: false,
    deck: emptyDeck,
  },
};

export const DialogStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withMethods((store) => ({
    updateSettingsDialog(settings: boolean): void {
      patchState(store, (state) => ({ settings }));
    },
    updateViewCardDialog(viewCard: ViewCardDialog): void {
      patchState(store, (state) => ({ viewCard }));
    },
    updateExportDeckDialog(exportDeck: ExportDeckDialog): void {
      patchState(store, (state) => ({ exportDeck }));
    },

    showViewCardDialog(show: boolean): void {
      patchState(store, (state) => ({ viewCard: { ...state.viewCard, show } }));
    },
    showExportDeckDialog(show: boolean): void {
      patchState(store, (state) => ({
        exportDeck: { ...state.exportDeck, show },
      }));
    },
  })),
);
