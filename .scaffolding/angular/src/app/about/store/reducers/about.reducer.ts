import { createReducer, on, createSelector, createFeatureSelector } from '@ngrx/store';
import { AboutState } from '../models/about-state.model';
import { loadTeam, loadTeamFailure, loadTeamSuccess } from '../actions/about.actions';

export const initialAboutState: AboutState = {
  team: [],
  loading: false,
  error: null,
};

export const aboutReducer = createReducer(
  initialAboutState,
  on(loadTeam, (state) => ({ ...state, loading: true, error: null })),
  on(loadTeamSuccess, (state, { team }) => ({ ...state, team, loading: false })),
  on(loadTeamFailure, (state, { error }) => ({ ...state, error, loading: false }))
);

const selectAboutFeature = createFeatureSelector<AboutState>('about');

export const selectAboutTeam = createSelector(selectAboutFeature, (s) => s.team);
export const selectAboutLoading = createSelector(selectAboutFeature, (s) => s.loading);
