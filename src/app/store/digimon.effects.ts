import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  EMPTY, exhaustMap,
  first,
  map, mergeMap, of,
  switchMap,
  tap
} from 'rxjs';
import { setupDigimonCards } from '../../assets/cardlists/DigimonCards';
import { IBlog, ISave } from '../../models';
import { CARDSET } from '../../models/enums/card-set.enum';
import { filterCards } from '../functions/filter.functions';
import { AuthService } from '../services/auth.service';
import { DigimonBackendService } from '../services/digimon-backend.service';
import {
  CollectionActions,
  DeckActions,
  DigimonActions,
  SaveActions,
  WebsiteActions,
} from './digimon.actions';
import {
  selectCardSet,
  selectChangeAdvancedSettings,
  selectChangeFilterEffect,
  selectSave,
} from './digimon.selectors';
import { emptySave } from './reducers/save.reducer';

@Injectable()
export class DigimonEffects {
  save$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          CollectionActions.setCardCount,
          SaveActions.setCardSets,
          SaveActions.setSave,
          DeckActions.import,
          DeckActions.save,
          DeckActions.delete,
          SaveActions.setCardSize,
          SaveActions.setCollectionMode,
          CollectionActions.addCard,
          WebsiteActions.setCollectionMinimum,
          WebsiteActions.setShowVersion
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
                  localStorage.setItem(
                    'Digimon-Card-Collector',
                    JSON.stringify(save)
                  );
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
        ofType(
          DigimonActions.setDigimonCards,
          WebsiteActions.setFilter,
          WebsiteActions.setSearchFilter,
          WebsiteActions.setColorFilter,
          WebsiteActions.setCardTypeFilter,
          WebsiteActions.setBlockFilter,
          WebsiteActions.setRarityFilter,
          WebsiteActions.setVersionFilter,
          WebsiteActions.setSetFilter,
          WebsiteActions.setSort
        ),
        switchMap(() =>
          this.store
            .select(selectChangeFilterEffect)
            .pipe(first(), debounceTime(300), distinctUntilChanged())
            .pipe(
              tap(({ cards, collection, filter, sort, digimonCardMap }) => {
                if (!cards) return;

                const filteredCards = filterCards(
                  cards,
                  collection,
                  filter,
                  sort,
                  digimonCardMap
                );
                this.store.dispatch(
                  DigimonActions.setFilteredDigimonCards({ filteredCards })
                );
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
        ofType(
          SaveActions.getSave,
          SaveActions.setSave,
          WebsiteActions.setShowVersion
        ),
        switchMap(() =>
          this.store
            .select(selectChangeAdvancedSettings)
            .pipe(first())
            .pipe(
              tap(
                ({
                  showPreRelease,
                  showAA,
                  showStamped,
                  showReprint,
                  filter,
                }) => {
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
                    let versionFilter = filter.versionFilter.filter(
                      (filter) => filter !== 'Pre-Release'
                    );
                    if (versionFilter.length === 0) {
                      versionFilter = ['Normal', 'AA', 'Stamp', 'Reprint'];
                    }
                    filter = { ...filter, versionFilter };
                  }
                  if (!showAA) {
                    let versionFilter = filter.versionFilter.filter(
                      (filter) => filter !== 'AA'
                    );
                    if (versionFilter.length === 0) {
                      versionFilter = [
                        'Normal',
                        'Stamp',
                        'Pre-Release',
                        'Reprint',
                      ];
                    }
                    filter = { ...filter, versionFilter };
                  }
                  if (!showStamped) {
                    let versionFilter = filter.versionFilter.filter(
                      (filter) => filter !== 'Stamp'
                    );
                    if (versionFilter.length === 0) {
                      versionFilter = [
                        'Normal',
                        'AA',
                        'Pre-Release',
                        'Reprint',
                      ];
                    }
                    filter = { ...filter, versionFilter };
                  }
                  if (!showReprint) {
                    let versionFilter = filter.versionFilter.filter(
                      (filter) => filter !== 'Reprint'
                    );
                    if (versionFilter.length === 0) {
                      versionFilter = ['Normal', 'AA', 'Pre-Release', 'Stamp'];
                    }
                    filter = { ...filter, versionFilter };
                  }
                  this.store.dispatch(WebsiteActions.setFilter({ filter }));
                }
              ),
              catchError(() => EMPTY)
            )
        )
      ),
    { dispatch: false }
  );

  setDigimonCardSet$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          SaveActions.setSave,
          SaveActions.getSave,
          SaveActions.setCardSets
        ),
        switchMap(() =>
          this.store.select(selectCardSet).pipe(
            tap((cardSet) => {
              if (cardSet === undefined) {
                return;
              }

              let digimonCards;
              if (+cardSet >>> 0) {
                digimonCards = setupDigimonCards(CARDSET.English);
              } else {
                digimonCards = setupDigimonCards(cardSet as CARDSET);
              }
              this.store.dispatch(
                DigimonActions.setDigimonCards({ digimonCards })
              );
            }),
            catchError(() => EMPTY)
          )
        )
      ),
    { dispatch: false }
  );

  loadSave$ = createEffect(() => this.actions$.pipe(
    ofType(SaveActions.loadSave),
    exhaustMap(() => this.authService.loadSave()
      .pipe(
        map((save: ISave) => {
          this.store.dispatch(
            SaveActions.setSave({ save: { ...save, version: emptySave.version } })
          );

          this.toastrService.info(
            'Your save was loaded successfully!',
            'Welcome back!'
          );

          return ({ type: '[Save] Load Save Success' });
        }),
        catchError(() => {
          this.toastrService.info(
            'There was an error while loading your save, please refresh the site!',
            'Save Loading Error!'
          );

          return of({ type: '[Save] Load Save Failure' });
        })
      )
    )
  ));

  loadBlogs$ = createEffect(() => this.actions$.pipe(
    ofType(WebsiteActions.loadBlogs),
    exhaustMap(() => this.digimonBackendService.getBlogEntries()
      .pipe(
        map((blogs: IBlog[]) => {
          this.store.dispatch(
            WebsiteActions.setBlogs({ blogs })
          );

          return ({ type: '[Website] Load Blogs Success' });
        }),
        catchError(() => {
          return of({ type: '[Website] Load Blogs Failure' });
        })
      )
    )
  ));

  constructor(
    private store: Store,
    private authService: AuthService,
    private digimonBackendService: DigimonBackendService,
    private actions$: Actions,
    private toastrService: ToastrService
  ) {}
}
