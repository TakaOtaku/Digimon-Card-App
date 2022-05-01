import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {Store} from "@ngrx/store";
import {catchError, EMPTY, first, map, switchMap, tap} from "rxjs";
import {CARDSET} from "../../models/card-set.enum";
import {setupDigimonCards} from "../functions/digimon-card.functions";
import {filterCards} from "../functions/filter.functions";
import {AuthService} from "../service/auth.service";
import {DatabaseService} from "../service/database.service";
import * as DigimonActions from "./digimon.actions";
import {selectCardSet, selectChangeAdvancedSettings, selectChangeFilterEffect, selectSave} from "./digimon.selectors";

@Injectable()
export class DigimonEffects {
  save$ = createEffect(() => this.actions$.pipe(
    ofType(
      DigimonActions.changeCardCount,
      DigimonActions.changeCardSets,
      DigimonActions.setSave,
      DigimonActions.importDeck,
      DigimonActions.changeDeck,
      DigimonActions.deleteDeck,
      DigimonActions.changeCardSize,
      DigimonActions.changeCollectionMode,
      DigimonActions.addToCollection,
      DigimonActions.changeCollectionMinimum,
      DigimonActions.changeShowVersion,
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
        DigimonActions.setDigimonCards,
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

  changeAdvancedSettings$ = createEffect(() => this.actions$.pipe(
      ofType(
        DigimonActions.loadSave,
        DigimonActions.changeShowVersion,
      ),
      switchMap(() => this.store.select(selectChangeAdvancedSettings).pipe(first())
        .pipe(
          tap(({showPreRelease, showAA, showStamped, filter}) => {
            if(showPreRelease === undefined || showAA === undefined || showStamped === undefined) {return}

            filter = {...filter, versionFilter: []};
            if(!showPreRelease) {
              let versionFilter = filter.versionFilter.filter(filter => filter !== 'Pre-Release');
              if(versionFilter.length === 0) {versionFilter = ['Normal', 'AA', 'Stamp']}
              filter = {...filter, versionFilter};
            }
            if(!showAA) {
              let versionFilter = filter.versionFilter.filter(filter => filter !== 'AA');
              if(versionFilter.length === 0) {versionFilter = ['Normal', 'Stamp', 'Pre-Release']}
              filter = {...filter, versionFilter};
            }
            if(!showStamped) {
              let versionFilter = filter.versionFilter.filter(filter => filter !== 'Stamp');
              if(versionFilter.length === 0) {versionFilter = ['Normal', 'AA', 'Pre-Release']}
              filter = {...filter, versionFilter};
            }
            this.store.dispatch(DigimonActions.changeFilter({filter}));
          }),
          catchError(() => EMPTY)
        ))
    ), {dispatch: false}
  );

  setDigimonCardSet$ = createEffect(() => this.actions$.pipe(
      ofType(
        DigimonActions.loadSave,
        DigimonActions.changeCardSets
      ),
      switchMap(() => this.store.select(selectCardSet).pipe()
        .pipe(
          tap((cardSet) => {
            if(cardSet === undefined) {return}
            const digimonCards = +cardSet>>>0 ? setupDigimonCards(CARDSET.Overwrite) : setupDigimonCards(cardSet);
            this.store.dispatch(DigimonActions.setDigimonCards({digimonCards}));
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
