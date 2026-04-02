import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TeamMember } from './store/models/team-member.model';
import { loadTeam } from './store/actions/about.actions';
import { selectAboutLoading, selectAboutTeam } from './store/reducers/about.reducer';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  team$: Observable<TeamMember[]>;
  loading$: Observable<boolean>;

  constructor(private store: Store) {
    this.team$ = this.store.select(selectAboutTeam);
    this.loading$ = this.store.select(selectAboutLoading);
  }

  ngOnInit(): void {
    this.store.dispatch(loadTeam());
  }
}
