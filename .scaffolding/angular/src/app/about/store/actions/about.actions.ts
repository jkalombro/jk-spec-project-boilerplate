import { createAction, props } from '@ngrx/store';
import { TeamMember } from '../models/team-member.model';

export const loadTeam = createAction('[About] Load Team');

export const loadTeamSuccess = createAction(
  '[About] Load Team Success',
  props<{ team: TeamMember[] }>()
);

export const loadTeamFailure = createAction(
  '[About] Load Team Failure',
  props<{ error: string }>()
);
