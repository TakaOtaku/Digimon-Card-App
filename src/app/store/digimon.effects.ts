import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {Store} from "@ngrx/store";
import {CookieService} from "ngx-cookie-service";
import {catchError, combineLatest, EMPTY, map, mergeMap, switchMap, tap} from "rxjs";
import {
  BT01_03_1_0CardList,
  BT01_03_1_5CardList,
  BT04CardList,
  BT05CardList,
  BT06CardList,
  BT07CardList,
  EX01CardList,
  PromotionCardList,
  ST01CardList,
  ST02CardList,
  ST03CardList,
  ST04CardList,
  ST05CardList,
  ST06CardList,
  ST07CardList,
  ST08CardList
} from "../cardlists";
import {filterCards} from "../functions/filter.functions";
import {ICard} from "../models";
import {setDigimonCards, setFilteredDigimonCards} from "./actions/digimon.actions";
import * as SaveActions from "./actions/save.actions";
import {
  selectAllCards,
  selectChangeFilterEffect,
  selectCollection,
  selectFilter,
  selectSave,
  selectSort
} from "./digimon.selectors";

@Injectable()
export class DigimonEffects {
  saveCookie$ = createEffect(() => this.actions$.pipe(
      ofType(
        SaveActions.changeCardCount,
        SaveActions.increaseCardCount,
        SaveActions.decreaseCardCount,
        SaveActions.setSave,
        SaveActions.changeFilter,
        SaveActions.changeSort,
        SaveActions.changeCardSize,
        SaveActions.changeCollectionMode,
        SaveActions.importDeck,
        SaveActions.deleteDeck
      ),
      switchMap(() => this.store.select(selectSave)
        .pipe(
          map(save => this.cookies.set('Digimon-Card-Collector', JSON.stringify(save), new Date(2100, 1))),
          catchError(() => EMPTY)
        ))
    ), {dispatch: false}
  );

  changeFilteredCards$ = createEffect(() => this.actions$.pipe(
      ofType(
        SaveActions.setSave,
        SaveActions.changeFilter,
        SaveActions.changeSort,
      ),
    switchMap(() => this.store.select(selectChangeFilterEffect)
        .pipe(
          tap(({cards, collection, filter, sort}) => {
            if (!cards) { return;}
            const filteredCards = filterCards(cards, collection, filter, sort);
            console.log("All Filtered Digimon Cards: ", filteredCards);
            this.store.dispatch(setFilteredDigimonCards({filteredCards}));
          }),
          catchError(() => EMPTY)
        ))
    ), {dispatch: false}
  );

  // Setup all Cards and Filter them
  loadSave$ = createEffect(() => this.actions$.pipe(
      ofType(
        SaveActions.loadSave
      ),
    mergeMap(() =>
      combineLatest(
        this.store.select(selectCollection),
        this.store.select(selectFilter),
        this.store.select(selectSort))
          .pipe(
            tap(([collection, filter, sort]) => {
              const loadedDigimonCards = this.setupDigimonCards();
              console.log("All Digimon Cards: ", loadedDigimonCards);
              const filteredCards = filterCards(loadedDigimonCards, collection, filter, sort);
              console.log("All Filtered Digimon Cards: ", filteredCards);
              this.store.dispatch(setFilteredDigimonCards({filteredCards}));
            })
          )
      )
    ), {dispatch: false}
  );

  constructor(
    private store: Store,
    private actions$: Actions,
    private cookies: CookieService
  ) {}

  private setupDigimonCards(): ICard[] {
    const allCards = PromotionCardList.concat(
      BT01_03_1_0CardList, BT01_03_1_5CardList,
      BT04CardList, BT05CardList,
      BT06CardList, BT07CardList,
      EX01CardList, ST01CardList,
      ST02CardList, ST03CardList,
      ST04CardList, ST05CardList,
      ST06CardList, ST07CardList,
      ST08CardList
    );
    allCards.sort(function(a, b){
      if(a.cardNumber < b.cardNumber) { return -1; }
      if(a.cardNumber > b.cardNumber) { return 1; }
      return 0;
    })
    this.store.dispatch(setDigimonCards({ allCards }));
    return allCards;
  }
}
