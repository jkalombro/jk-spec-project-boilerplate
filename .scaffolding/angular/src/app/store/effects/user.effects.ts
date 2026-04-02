import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { UserApiService } from '../api/user-api.service';
import { loadUser, setUser } from '../actions/user.actions';

@Injectable()
export class UserEffects {
  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUser),
      switchMap(() =>
        this.userApi.getUserProfile().pipe(map((user) => setUser({ user })))
      )
    )
  );

  constructor(private actions$: Actions, private userApi: UserApiService) {}
}
