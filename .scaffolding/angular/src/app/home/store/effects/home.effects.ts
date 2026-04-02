import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { HomeApiService } from '../api/home-api.service';
import { loadStats, loadStatsFailure, loadStatsSuccess } from '../actions/home.actions';

@Injectable()
export class HomeEffects {
  loadStats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadStats),
      switchMap(() =>
        this.homeApi.getStats().pipe(
          map((stats) => loadStatsSuccess({ stats })),
          catchError((err) => of(loadStatsFailure({ error: err.message })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private homeApi: HomeApiService) {}
}
