import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { ToastrService } from 'ngx-toastr';
import { distinctUntilChanged, first, pipe, switchMap } from 'rxjs';
import { emptySave, ICountCard, IDeck, ISave, ISettings } from '../../models';
import { AuthService } from '../services/auth.service';

type Save = {
  save: ISave;
  loadedSave: boolean;
};

const initialState: Save = {
  save: emptySave,
  loadedSave: false,
};

export const SaveStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed(({ save }) => ({
    settings: computed(() => save.settings()),
    collectionMode: computed(() => save.settings().collectionMode),
    collectionMinimum: computed(() => save.settings().collectionMinimum),
    aaCollectionMinimum: computed(() => save.settings().aaCollectionMinimum),
    displaySideDeck: computed(() => save.settings().displaySideDeck),
    collection: computed(() => save.collection()),
    decks: computed(() => save.decks()),
  })),

  withMethods(
    (
      store,
      toastrService = inject(ToastrService),
      authService = inject(AuthService),
    ) => ({
      loadSave: rxMethod<void>(
        pipe(
          first(),
          distinctUntilChanged(),
          switchMap(() => {
            return authService.loadSave().pipe(
              tapResponse({
                next: (save) => {
                  toastrService.info(
                    'Your save was loaded successfully!',
                    'Welcome back!',
                  );

                  patchState(store, {
                    save: {
                      ...save,
                      version: emptySave.version,
                    },
                  });
                },
                error: () => {
                  toastrService.info(
                    'There was an error while loading your save, please refresh the site!',
                    'Save Loading Error!',
                  );
                },
                finalize: () => patchState(store, { loadedSave: true }),
              }),
            );
          }),
        ),
      ),

      updateSave(save: ISave): void {
        patchState(store, (state) => ({ save }));
      },
      updateSettings(settings: ISettings): void {
        patchState(store, (state) => ({ save: { ...state.save, settings } }));
      },
      updateCollection(collection: ICountCard[]): void {
        patchState(store, (state) => ({ save: { ...state.save, collection } }));
      },
      updateDeck(decks: IDeck[]): void {
        patchState(store, (state) => ({ save: { ...state.save, decks } }));
      },

      updateCard(id: string, count: number): void {
        patchState(store, (state) => {
          const taken = state.save.collection.find((card) => card.id === id);
          let collection = [...state.save.collection];
          if (taken) {
            // Increase the Cards Count
            collection = state.save.collection.map((card) => {
              if (card.id !== id) {
                return card;
              }
              return { id, count } as ICountCard;
            });
          } else {
            // Create new Card and add it to the state
            const card = { id, count } as ICountCard;
            collection = [...state.save.collection, card];
          }
          return { save: { ...state.save, collection } };
        });
      },
      addCard(card: ICountCard[]): void {
        patchState(store, (state) => {
          const collection = [...state.save.collection, ...card];
          return { save: { ...state.save, collection } };
        });
      },

      importDeck(deck: IDeck): void {
        patchState(store, (state) => {
          // If there are no decks, just add the deck to the array
          if (!state.save.decks) {
            return { save: { ...state.save, decks: [deck] } };
          }

          // If you have a deck with the same ID overwrite it
          const foundDeck = state.save.decks?.find(
            (value) => value.id === deck.id,
          );
          if (foundDeck) {
            const allButFoundDeck: IDeck[] = state.save.decks.filter(
              (value) => value.id !== deck.id,
            );
            const decks: IDeck[] = [...new Set([...allButFoundDeck, deck])];
            return { save: { ...state.save, decks } };
          }

          // Add the deck to the decks
          return {
            save: { ...state.save, decks: [...state.save.decks, deck] },
          };
        });
      },
      saveDeck(deck: IDeck): void {
        patchState(store, (state) => {
          // Change the Deck with the same ID
          const decks = state.save.decks.map((value) => {
            if (value?.id === deck.id) {
              return deck;
            }
            return value;
          });

          return { save: { ...state.save, decks: [...new Set(decks)] } };
        });
      },
      deleteDeck(deck: IDeck): void {
        patchState(store, (state) => {
          // Make an Array without the deck, which was given
          const decks = [
            ...new Set(state.save.decks.filter((item) => item.id !== deck.id)),
          ];
          return { save: { ...state.save, decks } };
        });
      },
    }),
  ),
);
