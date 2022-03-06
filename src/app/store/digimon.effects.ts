import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {Store} from "@ngrx/store";
import {CookieService} from "ngx-cookie-service";
import {catchError, EMPTY, map, switchMap} from "rxjs";
import * as DigimonActions from "./digimon.actions";
import {selectSave} from "./digimon.selectors";

@Injectable()
export class DigimonEffects {

  loadMovies$ = createEffect(() => this.actions$.pipe(
      ofType(DigimonActions.increaseCardCount, DigimonActions.decreaseCardCount),
      switchMap(() => this.store.select(selectSave)
        .pipe(
          map(save => {
            this.cookies.set('Digimon-Card-Collector', JSON.stringify(save), new Date(2100, 1))
            return {type: '[Digimon Card Save] Save Cookie'};
          }),
          catchError(() => EMPTY)
        ))
    )
  );

  constructor(
    private store: Store,
    private actions$: Actions,
    private cookies: CookieService
  ) {}
}
