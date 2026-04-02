import { Routes } from '@angular/router';
import { AboutComponent } from './about.component';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { aboutReducer } from './store/reducers/about.reducer';
import { AboutEffects } from './store/effects/about.effects';

export const aboutRoutes: Routes = [{
  path: '',
  component: AboutComponent,
  providers: [
    provideState('about', aboutReducer),
    provideEffects([AboutEffects]),
  ],
}];
