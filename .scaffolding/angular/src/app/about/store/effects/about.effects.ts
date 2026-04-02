import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AboutApiService } from '../api/about-api.service';
import { loadTeam, loadTeamFailure, loadTeamSuccess } from '../actions/about.actions';

@Injectable()
export class AboutEffects {
  loadTeam$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTeam),
      switchMap(() =>
        this.aboutApi.getTeamMembers().pipe(
          map((team) => loadTeamSuccess({ team })),
          catchError((err) => of(loadTeamFailure({ error: err.message })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private aboutApi: AboutApiService) {}
}
