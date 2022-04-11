import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {Store} from "@ngrx/store";
import {catchError, EMPTY, first, map, switchMap, tap} from "rxjs";
import {filterCards} from "../functions/filter.functions";
import {AuthService} from "../service/auth.service";
import {DatabaseService} from "../service/database.service";
import * as DigimonActions from "./digimon.actions";
import {selectChangeFilterEffect, selectSave} from "./digimon.selectors";

@Injectable()
export class DigimonEffects {
  save$ = createEffect(() => this.actions$.pipe(
    ofType(
      DigimonActions.changeCardCount,
      DigimonActions.setSave,
      DigimonActions.importDeck,
      DigimonActions.changeDeck,
      DigimonActions.deleteDeck,
      DigimonActions.changeCardSize,
      DigimonActions.changeCollectionMode,
      DigimonActions.addToCollection
      ),
    switchMap(() => this.store.select(selectSave).pipe(first())
      .pipe(
        map(save => {
          this.authService.isLoggedIn ?
            this.dbService.setSave(this.authService.userData!.uid, save) :
            localStorage.setItem('Digimon-Card-Collector', JSON.stringify(save));
        }),
        catchError(() => EMPTY)
        ))
    ), {dispatch: false}
  );

  changeFilteredCards$ = createEffect(() => this.actions$.pipe(
      ofType(
        DigimonActions.changeFilter,
        DigimonActions.changeSort,
      ),
    switchMap(() => this.store.select(selectChangeFilterEffect).pipe(first())
      .pipe(
        tap(({cards, collection, filter, sort}) => {
          if (!cards) return

          const filteredCards = filterCards(cards, collection, filter, sort);
          this.store.dispatch(DigimonActions.setFilteredDigimonCards({filteredCards}));
        }),
        catchError(() => EMPTY)
      ))
    ), {dispatch: false}
  );

  constructor(
    private store: Store,
    private authService: AuthService,
    private dbService: DatabaseService,
    private actions$: Actions
  ) {}
}
