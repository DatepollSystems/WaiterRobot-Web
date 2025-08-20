import {Routes} from '@angular/router';

import {maxiGuard} from '../../guards/maxi.guard';

export const ROUTES: Routes = [
  {
    path: '',
    canActivate: [maxiGuard],
    loadComponent: () => import('./maxi.layout').then((c) => c.MaxiLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./maxi.page').then((c) => c.MaxiPage),
      },
    ],
  },
];
