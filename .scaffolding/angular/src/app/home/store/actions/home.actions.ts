import { createAction, props } from '@ngrx/store';
import { StatCard } from '../models/stat-card.model';

export const loadStats = createAction('[Home] Load Stats');

export const loadStatsSuccess = createAction(
  '[Home] Load Stats Success',
  props<{ stats: StatCard[] }>()
);

export const loadStatsFailure = createAction(
  '[Home] Load Stats Failure',
  props<{ error: string }>()
);
