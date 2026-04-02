import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AboutComponent } from './about.component';
import { TimelineItemComponent } from './components/timeline-item/timeline-item.component';
import { TeamCardComponent } from './components/team-card/team-card.component';
import { TechStackComponent } from './components/tech-stack/tech-stack.component';
import { aboutReducer } from './store/reducers/about.reducer';
import { AboutEffects } from './store/effects/about.effects';

const routes: Routes = [{ path: '', component: AboutComponent }];

@NgModule({
  declarations: [AboutComponent, TimelineItemComponent, TeamCardComponent, TechStackComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature('about', aboutReducer),
    EffectsModule.forFeature([AboutEffects]),
  ],
})
export class AboutModule {}
