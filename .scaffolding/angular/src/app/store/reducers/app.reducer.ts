import { createReducer, on, createSelector, createFeatureSelector } from '@ngrx/store';
import { AppSlice } from '../models/app-state.model';
import { addNotification, clearNotification, setTheme } from '../actions/app.actions';

export const initialAppState: AppSlice = {
  theme: 'light',
  notifications: [],
};

export const appReducer = createReducer(
  initialAppState,
  on(setTheme, (state, { theme }) => ({ ...state, theme })),
  on(addNotification, (state, { notification }) => ({
    ...state,
    notifications: [...state.notifications, notification],
  })),
  on(clearNotification, (state, { id }) => ({
    ...state,
    notifications: state.notifications.filter((n) => n.id !== id),
  }))
);

const selectAppFeature = createFeatureSelector<AppSlice>('app');

export const selectTheme = createSelector(selectAppFeature, (s) => s.theme);
export const selectNotifications = createSelector(selectAppFeature, (s) => s.notifications);
