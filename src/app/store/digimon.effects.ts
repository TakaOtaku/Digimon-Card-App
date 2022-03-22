import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {Store} from "@ngrx/store";
import {CookieService} from "ngx-cookie-service";
import {catchError, EMPTY, map, switchMap, tap} from "rxjs";
import {filterCards} from "../functions/filter.functions";
import * as DigimonActions from "./digimon.actions";
import {selectChangeFilterEffect, selectSave} from "./digimon.selectors";

@Injectable()
export class DigimonEffects {
  saveCookie$ = createEffect(() => this.actions$.pipe(
      ofType(
        DigimonActions.changeCardCount,
        DigimonActions.increaseCardCount,
        DigimonActions.decreaseCardCount,
        DigimonActions.setSave,
        DigimonActions.importDeck,
        DigimonActions.changeDeck,
        DigimonActions.deleteDeck,
        DigimonActions.changeCardSize,
        DigimonActions.changeCollectionMode,
        DigimonActions.addToCollection
      ),
      switchMap(() => this.store.select(selectSave)
        .pipe(
          map(save => {
            localStorage.setItem('Digimon-Card-Collector', JSON.stringify(save));
          }),
          catchError((err) => {
            return EMPTY
          })
        ))
    ), {dispatch: false}
  );

  changeFilteredCards$ = createEffect(() => this.actions$.pipe(
      ofType(
        DigimonActions.changeFilter,
        DigimonActions.changeSort,
      ),
    switchMap(() => this.store.select(selectChangeFilterEffect)
        .pipe(
          tap(({cards, collection, filter, sort}) => {
            if (!cards) { return;}
            const filteredCards = filterCards(cards, collection, filter, sort);
            this.store.dispatch(DigimonActions.setFilteredDigimonCards({filteredCards}));
          }),
          catchError(() => EMPTY)
        ))
    ), {dispatch: false}
  );

  constructor(
    private store: Store,
    private actions$: Actions
  ) {}
}
