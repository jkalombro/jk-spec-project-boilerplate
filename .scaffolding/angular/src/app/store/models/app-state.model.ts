import { Notification } from './notification.model';
import { User } from './user.model';

export interface AppSlice {
  theme: 'light' | 'dark';
  notifications: Notification[];
}

export interface UserSlice {
  user: User | null;
  loading: boolean;
}

export interface AppState {
  app: AppSlice;
  user: UserSlice;
}
