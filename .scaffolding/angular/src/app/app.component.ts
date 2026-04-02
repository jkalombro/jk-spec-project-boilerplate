import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from './store/models/app-state.model';
import { User } from './store/models/user.model';
import { Notification } from './store/models/notification.model';
import { loadUser } from './store/actions/user.actions';
import { selectUser } from './store/reducers/user.reducer';
import { selectNotifications } from './store/reducers/app.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = '__APP_NAME__';

  user$: Observable<User | null>;
  notifications$: Observable<Notification[]>;

  constructor(private store: Store<AppState>) {
    this.user$ = this.store.select(selectUser);
    this.notifications$ = this.store.select(selectNotifications);
  }

  ngOnInit(): void {
    this.store.dispatch(loadUser());
  }
}
