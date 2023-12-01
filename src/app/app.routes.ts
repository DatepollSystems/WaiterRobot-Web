import {Routes} from '@angular/router';

import {isAuthenticated} from './home/_shared/guards/is-authenticated.guard';

export const ROUTES: Routes = [
  {path: 'info', title: 'INFORMATION', loadChildren: () => import('./outside/info/info.routes').then((m) => m.ROUTES)},
  {
    path: '',
    loadChildren: () => import('./home/home.routes').then((m) => m.ROUTES),
    canActivate: [isAuthenticated],
  },
  {
    path: '',
    loadChildren: () => import('./outside/outside.routes').then((m) => m.ROUTES),
  },
  {path: '**', redirectTo: '/not-found'},
];
