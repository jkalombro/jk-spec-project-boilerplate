import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { homeReducer } from './store/reducers/home.reducer';
import { HomeEffects } from './store/effects/home.effects';

export const homeRoutes: Routes = [{
  path: '',
  component: HomeComponent,
  providers: [
    provideState('home', homeReducer),
    provideEffects([HomeEffects]),
  ],
}];
