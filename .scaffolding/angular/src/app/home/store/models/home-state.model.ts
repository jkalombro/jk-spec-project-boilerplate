import { StatCard } from './stat-card.model';

export interface HomeState {
  stats: StatCard[];
  loading: boolean;
  error: string | null;
}
