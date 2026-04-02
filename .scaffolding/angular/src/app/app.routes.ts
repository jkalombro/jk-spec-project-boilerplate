import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () => import('./home/home.routes').then(r => r.homeRoutes),
  },
  {
    path: 'about',
    loadChildren: () => import('./about/about.routes').then(r => r.aboutRoutes),
  },
];
