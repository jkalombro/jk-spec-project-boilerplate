import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { loadStats } from './store/actions/home.actions';
import { selectHomeLoading, selectHomeStats } from './store/reducers/home.reducer';
import { HeroHeaderComponent } from './components/hero-header/hero-header.component';
import { StatCardComponent } from './components/stat-card/stat-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroHeaderComponent, StatCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  // Private variables
  private readonly store = inject(Store);

  // Public variables (signals)
  readonly stats = toSignal(this.store.select(selectHomeStats), { initialValue: [] });
  readonly loading = toSignal(this.store.select(selectHomeLoading), { initialValue: false });

  // Lifecycle methods
  ngOnInit(): void {
    this.store.dispatch(loadStats());
  }
}
