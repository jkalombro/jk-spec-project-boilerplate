import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { HomeComponent } from './home.component';
import { HeroHeaderComponent } from './components/hero-header/hero-header.component';
import { StatCardComponent } from './components/stat-card/stat-card.component';
import { homeReducer } from './store/reducers/home.reducer';
import { HomeEffects } from './store/effects/home.effects';

const routes: Routes = [{ path: '', component: HomeComponent }];

@NgModule({
  declarations: [HomeComponent, HeroHeaderComponent, StatCardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature('home', homeReducer),
    EffectsModule.forFeature([HomeEffects]),
  ],
})
export class HomeModule {}
