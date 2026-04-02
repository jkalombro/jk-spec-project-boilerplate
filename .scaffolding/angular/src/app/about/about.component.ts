import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { loadTeam } from './store/actions/about.actions';
import { selectAboutLoading, selectAboutTeam } from './store/reducers/about.reducer';
import { TeamCardComponent } from './components/team-card/team-card.component';
import { TechStackComponent } from './components/tech-stack/tech-stack.component';
import { TimelineItemComponent } from './components/timeline-item/timeline-item.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [TeamCardComponent, TechStackComponent, TimelineItemComponent],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent implements OnInit {
  // Private variables
  private readonly store = inject(Store);

  // Public variables (signals)
  readonly team = toSignal(this.store.select(selectAboutTeam), { initialValue: [] });
  readonly loading = toSignal(this.store.select(selectAboutLoading), { initialValue: false });

  // Lifecycle methods
  ngOnInit(): void {
    this.store.dispatch(loadTeam());
  }
}
