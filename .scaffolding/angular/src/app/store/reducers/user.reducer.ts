import { createReducer, on, createSelector, createFeatureSelector } from '@ngrx/store';
import { UserSlice } from '../models/app-state.model';
import { clearUser, loadUser, setUser } from '../actions/user.actions';

export const initialUserState: UserSlice = {
  user: null,
  loading: false,
};

export const userReducer = createReducer(
  initialUserState,
  on(loadUser, (state) => ({ ...state, loading: true })),
  on(setUser, (state, { user }) => ({ ...state, user, loading: false })),
  on(clearUser, (state) => ({ ...state, user: null, loading: false }))
);

const selectUserFeature = createFeatureSelector<UserSlice>('user');

export const selectUser = createSelector(selectUserFeature, (s) => s.user);
export const selectUserLoading = createSelector(selectUserFeature, (s) => s.loading);
