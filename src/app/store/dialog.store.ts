import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { DigimonCard, dummyCard, emptyDeck, IDeck } from '../../models';

interface DeckDialog {
  show: boolean;
  editable: boolean;
  deck: IDeck;
}

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
  changelog: boolean;
  settings: boolean;
  viewCard: ViewCardDialog;
  exportDeck: ExportDeckDialog;
  deck: DeckDialog;
};

const initialState: Dialog = {
  changelog: false,
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
  deck: {
    show: false,
    editable: true,
    deck: emptyDeck,
  },
};

export const DialogStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withMethods((store) => ({
    updateChangelogDialog(changelog: boolean): void {
      patchState(store, (state) => ({ changelog }));
    },
    updateSettingsDialog(settings: boolean): void {
      patchState(store, (state) => ({ settings }));
    },
    updateViewCardDialog(viewCard: ViewCardDialog): void {
      patchState(store, (state) => ({ viewCard }));
    },
    updateExportDeckDialog(exportDeck: ExportDeckDialog): void {
      patchState(store, (state) => ({ exportDeck }));
    },
    updateDeckDialog(deck: DeckDialog): void {
      patchState(store, (state) => ({ deck }));
    },

    showViewCardDialog(show: boolean): void {
      patchState(store, (state) => ({ viewCard: { ...state.viewCard, show } }));
    },
    showExportDeckDialog(show: boolean): void {
      patchState(store, (state) => ({
        exportDeck: { ...state.exportDeck, show },
      }));
    },
    showDeckDialog(show: boolean): void {
      patchState(store, (state) => ({
        deck: { ...state.deck, show },
      }));
    },
  })),
);
