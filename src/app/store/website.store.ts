import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { ToastrService } from 'ngx-toastr';
import { catchError, first, map, of } from 'rxjs';
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

  withMethods((store) => ({
    loadCommunityDecks(): void {
      const digimonBackendService = inject(DigimonBackendService);

      digimonBackendService
        .getDecks()
        .pipe(
          first(),
          catchError(() => {
            return of(null);
          }),
        )
        .subscribe((communityDecks) => {
          if (!communityDecks) return;

          patchState(store, (state) => ({ communityDecks }));
        });
    },

    loadBlogs(): void {
      const digimonBackendService = inject(DigimonBackendService);

      digimonBackendService
        .getBlogEntries()
        .pipe(
          first(),
          catchError(() => {
            return of(null);
          }),
        )
        .subscribe((blogs) => {
          if (!blogs) return;

          patchState(store, (state) => ({ blogs }));
        });
    },

    updateDeck(deck: IDeck): void {
      patchState(store, (state) => ({ deck }));
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
  })),
);
