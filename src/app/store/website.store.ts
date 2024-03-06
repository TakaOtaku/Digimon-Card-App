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
import {
  catchError,
  distinctUntilChanged,
  filter,
  first,
  map,
  of,
  pipe,
  switchMap,
} from 'rxjs';
import {
  DRAG,
  dummyCard,
  emptyDeck,
  emptyFilter,
  IBlog,
  ICountCard,
  IDeck,
  IDraggedCard,
  IFilter,
  ISave,
  ISettings,
  ISort,
} from '../../models';
import { emptySave } from '../../models/data/save.data';
import { checkSpecialCardCounts } from '../functions';
import { AuthService } from '../services/auth.service';
import { ProductCM } from '../services/card-market.service';
import { DigimonBackendService } from '../services/digimon-backend.service';

type Website = {
  deck: IDeck;
  mobileCollectionView: boolean;
  addCardToDeck: string;
  sort: ISort;
  communityDeckSearch: string;
  communityDecks: IDeck[];
  blogs: IBlog[];
  priceGuideCM: ProductCM[];
  draggedCard: IDraggedCard;
};

const initialState: Website = {
  deck: JSON.parse(JSON.stringify(emptyDeck)),
  mobileCollectionView: false,
  addCardToDeck: '',
  sort: {
    sortBy: {
      name: 'ID',
      element: 'id',
    },
    ascOrder: true,
  },
  communityDeckSearch: '',
  communityDecks: [],
  blogs: [],
  priceGuideCM: [],
  draggedCard: {
    card: JSON.parse(JSON.stringify(dummyCard)),
    drag: DRAG.Collection,
  },
};

export const WebsiteStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withMethods(
    (store, digimonBackendService = inject(DigimonBackendService)) => ({
      loadCommunityDecks: rxMethod<void>(
        pipe(
          first(),
          distinctUntilChanged(),
          switchMap(() => {
            return digimonBackendService.getDecks().pipe(
              filter((decks) => decks !== null),
              tapResponse({
                next: (communityDecks) =>
                  patchState(store, (state) => ({ communityDecks })),
                error: () => {},
                finalize: () => {},
              }),
            );
          }),
        ),
      ),

      loadBlogs: rxMethod<void>(
        pipe(
          first(),
          distinctUntilChanged(),
          switchMap(() => {
            return digimonBackendService.getBlogEntries().pipe(
              filter((blogs) => blogs !== null),
              tapResponse({
                next: (blogs) => patchState(store, (state) => ({ blogs })),
                error: () => {},
                finalize: () => {},
              }),
            );
          }),
        ),
      ),

      updateDeck(deck: IDeck): void {
        patchState(store, (state) => ({ deck }));
      },
      updateDeckTitle(title: string): void {
        patchState(store, (state) => ({ deck: { ...state.deck, title } }));
      },
      updateDeckDescription(description: string): void {
        patchState(store, (state) => ({
          deck: { ...state.deck, description },
        }));
      },

      updateMobileCollectionView(mobileCollectionView: boolean): void {
        patchState(store, (state) => ({ mobileCollectionView }));
      },
      updateAddCardToDeck(addCardToDeck: string): void {
        patchState(store, (state) => ({ addCardToDeck }));
      },
      updateSort(sort: ISort): void {
        patchState(store, (state) => ({ sort }));
      },
      updateCommunityDeckSearch(communityDeckSearch: string): void {
        patchState(store, (state) => ({ communityDeckSearch }));
      },
      updateCommunityDecks(communityDecks: IDeck[]): void {
        patchState(store, (state) => ({ communityDecks }));
      },
      updateBlogs(blogs: IBlog[]): void {
        patchState(store, (state) => ({ blogs }));
      },
      updatePriceGuideCM(priceGuideCM: ProductCM[]): void {
        patchState(store, (state) => ({ priceGuideCM }));
      },
      updateDraggedCard(draggedCard: IDraggedCard): void {
        patchState(store, (state) => ({ draggedCard }));
      },

      createNewDeck(id: string): void {
        patchState(store, (state) => ({ deck: { ...state.deck, id } }));
      },

      addCardToDeck(cardToAdd: string): void {
        patchState(store, (state) => {
          const cards = state.deck.cards.map((card) => {
            if (card.id === cardToAdd) {
              card.count += 1;
            }

            card.count = checkSpecialCardCounts(card);
            return card;
          });

          if (!cards.find((card) => card.id === cardToAdd)) {
            cards.push({ id: cardToAdd, count: 1 });
          }

          return { deck: { ...state.deck, cards } };
        });
      },
      removeCardFromDeck(cardToRemove: string): void {
        patchState(store, (state) => {
          const cards = state.deck.cards
            .map((card) => {
              if (card.id === cardToRemove) {
                card.count -= 1;
              }
              return card;
            })
            .filter((card) => card.count > 0);

          return { deck: { ...state.deck, cards } };
        });
      },

      addCardToSideDeck(cardToAdd: string): void {
        patchState(store, (state) => {
          const sideDeck = (state.deck.sideDeck ?? []).map((card) => {
            if (card.id === cardToAdd) {
              card.count += 1;
            }

            card.count = checkSpecialCardCounts(card);
            return card;
          });

          if (!sideDeck.find((card) => card.id === cardToAdd)) {
            sideDeck.push({ id: cardToAdd, count: 1 });
          }

          return { deck: { ...state.deck, sideDeck } };
        });
      },
      removeCardFromSideDeck(cardToRemove: string): void {
        patchState(store, (state) => {
          const sideDeck = (state.deck.sideDeck ?? [])
            .map((card) => {
              if (card.id === cardToRemove) {
                card.count -= 1;
              }
              return card;
            })
            .filter((card) => card.count > 0);

          return { deck: { ...state.deck, sideDeck } };
        });
      },
    }),
  ),
);
