import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { distinctUntilChanged, filter as rxFilter, first, pipe, switchMap } from 'rxjs';
import { DRAG, dummyCard, emptyDeck, IBlog, IDeck, IDraggedCard, ISort } from '../../models';
import { checkSpecialCardCounts } from '../functions';
import { MongoBackendService, IDeckFilter, IPaginationResponse } from '../services/mongo-backend.service';

type Website = {
  deck: IDeck;
  mobileCollectionView: boolean;
  addCardToDeck: string;
  sort: ISort;
  communityDeckSearch: string;
  communityDecks: IDeck[];
  blogs: IBlog[];
  draggedCard: IDraggedCard;
  // Pagination state
  decksPagination: {
    currentPage: number;
    totalPages: number;
    totalDecks: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  decksFilter: IDeckFilter;
  isLoadingDecks: boolean;
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
  draggedCard: {
    card: JSON.parse(JSON.stringify(dummyCard)),
    drag: DRAG.Collection,
  },
  decksPagination: {
    currentPage: 1,
    totalPages: 1,
    totalDecks: 0,
    limit: 20,
    hasNextPage: false,
    hasPrevPage: false,
  },
  decksFilter: {
    page: 1,
    limit: 20,
  },
  isLoadingDecks: false,
};

export const WebsiteStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withMethods((store, mongoBackendService = inject(MongoBackendService)) => ({
    loadCommunityDecks: rxMethod<void>(
      pipe(
        distinctUntilChanged(),
        switchMap(() => {
          patchState(store, { isLoadingDecks: true });
          return mongoBackendService.getDecksPaginated(store.decksFilter()).pipe(
            rxFilter((response) => response !== null),
            tapResponse({
              next: (response: IPaginationResponse<IDeck>) => {
                patchState(store, (state) => ({
                  communityDecks: response.data,
                  decksPagination: response.pagination,
                  isLoadingDecks: false
                }));
              },
              error: () => {
                patchState(store, { isLoadingDecks: false });
              },
              finalize: () => {
                patchState(store, { isLoadingDecks: false });
              },
            }),
          );
        }),
      ),
    ),

    loadCommunityDecksWithFilter: rxMethod<IDeckFilter>(
      pipe(
        distinctUntilChanged(),
        switchMap((filter) => {
          patchState(store, {
            isLoadingDecks: true,
            decksFilter: { ...store.decksFilter(), ...filter, page: 1 } // Reset to page 1 when filtering
          });
          return mongoBackendService.getDecksPaginated(store.decksFilter()).pipe(
            rxFilter((response) => response !== null),
            tapResponse({
              next: (response: IPaginationResponse<IDeck>) => {
                patchState(store, (state) => ({
                  communityDecks: response.data,
                  decksPagination: response.pagination,
                  isLoadingDecks: false
                }));
              },
              error: () => {
                patchState(store, { isLoadingDecks: false });
              },
              finalize: () => {
                patchState(store, { isLoadingDecks: false });
              },
            }),
          );
        }),
      ),
    ),

    loadDecksPage: rxMethod<number>(
      pipe(
        distinctUntilChanged(),
        switchMap((page) => {
          patchState(store, {
            isLoadingDecks: true,
            decksFilter: { ...store.decksFilter(), page }
          });
          return mongoBackendService.getDecksPaginated(store.decksFilter()).pipe(
            rxFilter((response) => response !== null),
            tapResponse({
              next: (response: IPaginationResponse<IDeck>) => {
                patchState(store, (state) => ({
                  communityDecks: response.data,
                  decksPagination: response.pagination,
                  isLoadingDecks: false
                }));
              },
              error: () => {
                patchState(store, { isLoadingDecks: false });
              },
              finalize: () => {
                patchState(store, { isLoadingDecks: false });
              },
            }),
          );
        }),
      ),
    ),

    loadBlogs: rxMethod<void>(
      pipe(
        distinctUntilChanged(),
        switchMap(() => {
          return mongoBackendService.getBlogEntries().pipe(
            rxFilter((blogs) => blogs !== null),
            tapResponse({
              next: (blogs: any) => patchState(store, (state) => ({ blogs })),
              error: () => { },
              finalize: () => { },
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
      // Also update the search filter and reload
      this.loadCommunityDecksWithFilter({ search: communityDeckSearch });
    },
    updateCommunityDecks(communityDecks: IDeck[]): void {
      patchState(store, (state) => ({ communityDecks }));
    },
    updateDecksFilter(filter: Partial<IDeckFilter>): void {
      patchState(store, (state) => ({
        decksFilter: { ...state.decksFilter, ...filter }
      }));
    },
    updateDecksPagination(pagination: any): void {
      patchState(store, (state) => ({ decksPagination: pagination }));
    },
    updateBlogs(blogs: IBlog[]): void {
      patchState(store, (state) => ({ blogs }));
    },
    updateDraggedCard(draggedCard: IDraggedCard): void {
      patchState(store, (state) => ({ draggedCard }));
    },

    createNewDeck(id: string): void {
      patchState(store, (state) => ({ deck: { ...emptyDeck, id } }));
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
  })),
);
