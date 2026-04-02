import { createAction, props } from '@ngrx/store';
import { Notification } from '../models/notification.model';

export const setTheme = createAction(
  '[App] Set Theme',
  props<{ theme: 'light' | 'dark' }>()
);

export const addNotification = createAction(
  '[App] Add Notification',
  props<{ notification: Notification }>()
);

export const clearNotification = createAction(
  '[App] Clear Notification',
  props<{ id: string }>()
);
