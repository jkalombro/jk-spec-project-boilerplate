import { ActionReducerMap } from '@ngrx/store';
import { AppState } from '../models/app-state.model';
import { appReducer } from './app.reducer';
import { userReducer } from './user.reducer';

export const appReducers: ActionReducerMap<AppState> = {
  app: appReducer,
  user: userReducer,
};
