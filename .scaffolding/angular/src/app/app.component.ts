import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { AppState } from './store/models/app-state.model';
import { loadUser } from './store/actions/user.actions';
import { selectUser } from './store/reducers/user.reducer';
import { selectNotifications } from './store/reducers/app.reducer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  // Public variables
  readonly title = '__APP_NAME__';

  // Private variables
  private readonly store = inject(Store<AppState>);

  // Public variables (signals)
  readonly user = toSignal(this.store.select(selectUser));
  readonly notifications = toSignal(this.store.select(selectNotifications), { initialValue: [] });

  // Lifecycle methods
  ngOnInit(): void {
    this.store.dispatch(loadUser());
  }
}
