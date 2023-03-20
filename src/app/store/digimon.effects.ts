import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, EMPTY, first, map, switchMap, tap } from 'rxjs';
import { CARDSET } from '../../models/enums/card-set.enum';
import { setupDigimonCards } from '../functions/digimon-card.functions';
import { filterCards } from '../functions/filter.functions';
import { AuthService } from '../service/auth.service';
import { DigimonBackendService } from '../service/digimon-backend.service';
import * as DigimonActions from './digimon.actions';
import { selectCardSet, selectChangeAdvancedSettings, selectChangeFilterEffect, selectSave } from './digimon.selectors';

@Injectable()
export class DigimonEffects {
  save$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          DigimonActions.changeCardCount,
          DigimonActions.changeCardSets,
          DigimonActions.setSave,
          DigimonActions.importDeck,
          DigimonActions.saveDeck,
          DigimonActions.deleteDeck,
          DigimonActions.changeCardSize,
          DigimonActions.changeCollectionMode,
          DigimonActions.addToCollection,
          DigimonActions.changeCollectionMinimum,
          DigimonActions.changeShowVersion
        ),
        switchMap(() =>
          this.store
            .select(selectSave)
            .pipe(first())
            .pipe(
              map((save) => {
                if (this.authService.isLoggedIn) {
                  this.digimonBackendService
                    .updateSave(save)
                    .pipe(first())
                    .subscribe(() => {});
                } else {
                  localStorage.setItem('Digimon-Card-Collector', JSON.stringify(save));
                }
              }),
              catchError(() => EMPTY)
            )
        )
      ),
    { dispatch: false }
  );

  changeFilteredCards$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DigimonActions.setDigimonCards, DigimonActions.changeFilter, DigimonActions.changeSort),
        switchMap(() =>
          this.store
            .select(selectChangeFilterEffect)
            .pipe(first())
            .pipe(
              tap(({ cards, collection, filter, sort }) => {
                if (!cards) return;

                const filteredCards = filterCards(cards, collection, filter, sort);
                this.store.dispatch(DigimonActions.setFilteredDigimonCards({ filteredCards }));
              }),
              catchError(() => EMPTY)
            )
        )
      ),
    { dispatch: false }
  );

  changeAdvancedSettings$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DigimonActions.loadSave, DigimonActions.setSave, DigimonActions.changeShowVersion),
        switchMap(() =>
          this.store
            .select(selectChangeAdvancedSettings)
            .pipe(first())
            .pipe(
              tap(({ showPreRelease, showAA, showStamped, showReprint, filter }) => {
                if (
                  showPreRelease === undefined ||
                  showAA === undefined ||
                  showStamped === undefined ||
                  showReprint === undefined
                ) {
                  return;
                }

                filter = { ...filter, versionFilter: [] };
                if (!showPreRelease) {
                  let versionFilter = filter.versionFilter.filter((filter) => filter !== 'Pre-Release');
                  if (versionFilter.length === 0) {
                    versionFilter = ['Normal', 'AA', 'Stamp', 'Reprint'];
                  }
                  filter = { ...filter, versionFilter };
                }
                if (!showAA) {
                  let versionFilter = filter.versionFilter.filter((filter) => filter !== 'AA');
                  if (versionFilter.length === 0) {
                    versionFilter = ['Normal', 'Stamp', 'Pre-Release', 'Reprint'];
                  }
                  filter = { ...filter, versionFilter };
                }
                if (!showStamped) {
                  let versionFilter = filter.versionFilter.filter((filter) => filter !== 'Stamp');
                  if (versionFilter.length === 0) {
                    versionFilter = ['Normal', 'AA', 'Pre-Release', 'Reprint'];
                  }
                  filter = { ...filter, versionFilter };
                }
                if (!showReprint) {
                  let versionFilter = filter.versionFilter.filter((filter) => filter !== 'Reprint');
                  if (versionFilter.length === 0) {
                    versionFilter = ['Normal', 'AA', 'Pre-Release', 'Stamp'];
                  }
                  filter = { ...filter, versionFilter };
                }
                this.store.dispatch(DigimonActions.changeFilter({ filter }));
              }),
              catchError(() => EMPTY)
            )
        )
      ),
    { dispatch: false }
  );

  setDigimonCardSet$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DigimonActions.loadSave, DigimonActions.setSave, DigimonActions.changeCardSets),
        switchMap(() =>
          this.store.select(selectCardSet).pipe(
            tap((cardSet) => {
              if (cardSet === undefined) {
                return;
              }

              let digimonCards;
              if (+cardSet >>> 0) {
                digimonCards = setupDigimonCards(CARDSET.Both);
              } else {
                digimonCards = setupDigimonCards(cardSet);
              }
              this.store.dispatch(DigimonActions.setDigimonCards({ digimonCards }));
            }),
            catchError(() => EMPTY)
          )
        )
      ),
    { dispatch: false }
  );

  constructor(
    private store: Store,
    private authService: AuthService,
    private digimonBackendService: DigimonBackendService,
    private actions$: Actions
  ) {}
}
