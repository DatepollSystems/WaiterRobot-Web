import {Routes} from '@angular/router';
import {maxiGuard} from './maxi.guard';

export const ROUTES: Routes = [
  {
    path: '',
    canActivate: [maxiGuard],
    loadComponent: () => import('./maxi.layout').then((c) => c.MaxiLayout),
    children: [{path: '', loadComponent: () => import('./maxi.component').then((c) => c.MaxiComponent)}],
  },
];
