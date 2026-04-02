import { createReducer, on, createSelector, createFeatureSelector } from '@ngrx/store';
import { HomeState } from '../models/home-state.model';
import { loadStats, loadStatsFailure, loadStatsSuccess } from '../actions/home.actions';

export const initialHomeState: HomeState = {
  stats: [],
  loading: false,
  error: null,
};

export const homeReducer = createReducer(
  initialHomeState,
  on(loadStats, (state) => ({ ...state, loading: true, error: null })),
  on(loadStatsSuccess, (state, { stats }) => ({ ...state, stats, loading: false })),
  on(loadStatsFailure, (state, { error }) => ({ ...state, error, loading: false }))
);

const selectHomeFeature = createFeatureSelector<HomeState>('home');

export const selectHomeStats = createSelector(selectHomeFeature, (s) => s.stats);
export const selectHomeLoading = createSelector(selectHomeFeature, (s) => s.loading);
