import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { StatCard } from './store/models/stat-card.model';
import { loadStats } from './store/actions/home.actions';
import { selectHomeLoading, selectHomeStats } from './store/reducers/home.reducer';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  stats$: Observable<StatCard[]>;
  loading$: Observable<boolean>;

  constructor(private store: Store) {
    this.stats$ = this.store.select(selectHomeStats);
    this.loading$ = this.store.select(selectHomeLoading);
  }

  ngOnInit(): void {
    this.store.dispatch(loadStats());
  }
}
