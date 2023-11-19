import { createActionGroup, props } from '@ngrx/store';
import {
  ICountCard,
  IDeck,
  IDraggedCard,
  IFilter,
  ISave,
  ISort,
} from '../../models';
import { IBlog } from '../../models/interfaces/blog-entry.interface';
import { DigimonCard } from '../../models/interfaces/digimon-card.interface';
import { ProductCM } from '../services/card-market.service';

export const DigimonActions = createActionGroup({
  source: 'Digimon Cards',
  events: {
    setDigimonCards: props<{ digimonCards: DigimonCard[] }>(),
    setDigimonCardMap: props<{ digimonCardMap: Map<string, DigimonCard> }>(),
    setFilteredDigimonCards: props<{ filteredCards: DigimonCard[] }>(),
  },
});

export const WebsiteActions = createActionGroup({
  source: 'Website',
  events: {
    setPriceGuideCM: props<{ products: ProductCM[] }>(),
    setDeck: props<{ deck: IDeck }>(),
    createNewDeck: props<{ uuid: string }>(),
    setFilter: props<{ filter: IFilter }>(),
    setSearchFilter: props<{ search: string }>(),
    setColorFilter: props<{ colorFilter: string[] }>(),
    setCardTypeFilter: props<{ cardTypeFilter: string[] }>(),
    setBlockFilter: props<{ blockFilter: string[] }>(),
    setRarityFilter: props<{ rarityFilter: string[] }>(),
    setVersionFilter: props<{ versionFilter: string[] }>(),
    setSetFilter: props<{ setFilter: string[] }>(),
    setSort: props<{ sort: ISort }>(),
    setMobileCollectionView: props<{ mobileCollectionView: boolean }>(),
    setCollectionMinimum: props<{ minimum: number }>(),
    setAACollectionMinimum: props<{ minimum: number }>(),
    setShowVersion: props<{
      showPre: boolean;
      showAA: boolean;
      showStamp: boolean;
    }>(),
    setCommunityDeckSearch: props<{ communityDeckSearch: string }>(),
    setCommunityDecks: props<{ communityDecks: IDeck[] }>(),
    setBlogs: props<{ blogs: IBlog[] }>(),
    setDraggedCard: props<{ dragCard: IDraggedCard }>(),
    addCardToDeck: props<{ addCardToDeck: string }>(),
    removeCardFromDeck: props<{ cardId: string }>(),
    addCardToSideDeck: props<{ cardId: string }>(),
    removeCardFromSideDeck: props<{ cardId: string }>(),
  },
});

export const SaveActions = createActionGroup({
  source: 'Save',
  events: {
    getSave: props<{ save: ISave }>(),
    setSave: props<{ save: ISave }>(),
    setCollection: props<{ collection: ICountCard[] }>(),
    setCardSize: props<{ cardSize: number }>(),
    setCollectionMode: props<{ collectionMode: boolean }>(),
    setCardSets: props<{ cardSet: string }>(),
    setShowUserStats: props<{ showUserStats: boolean }>(),
    setDeckDisplayTable: props<{ deckDisplayTable: boolean }>(),
    setShowReprintCards: props<{ showReprintCards: boolean }>(),
  },
});

export const CollectionActions = createActionGroup({
  source: 'Collection',
  events: {
    addCard: props<{ collectionCards: ICountCard[] }>(),
    setCardCount: props<{ id: string; count: number }>(),
  },
});

export const DeckActions = createActionGroup({
  source: 'Deck',
  events: {
    import: props<{ deck: IDeck }>(),
    delete: props<{ deck: IDeck }>(),
    save: props<{ deck: IDeck }>(),
  },
});
