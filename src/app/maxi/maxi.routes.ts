import {Routes} from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./maxi.layout').then((c) => c.MaxiLayout),
    children: [{path: '', loadComponent: () => import('./maxi.component').then((c) => c.MaxiComponent)}],
  },
];
