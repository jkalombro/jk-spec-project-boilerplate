import { TeamMember } from './team-member.model';

export interface AboutState {
  team: TeamMember[];
  loading: boolean;
  error: string | null;
}
