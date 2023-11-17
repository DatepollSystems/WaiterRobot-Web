import {Routes} from '@angular/router';

import {isAuthenticated} from './_shared/services/auth/is-authenticated.guard';

export const ROUTES: Routes = [
  {path: 'info', title: 'INFORMATION', loadChildren: () => import('./info/info.routes').then((m) => m.ROUTES)},
  {path: 'login', loadChildren: () => import('./login/login.routes').then((m) => m.ROUTES)},
  {
    path: '',
    loadChildren: () => import('./home/home.routes').then((m) => m.ROUTES),
    canActivate: [isAuthenticated],
  },
  {
    path: 'ml',
    loadChildren: () => import('./mobile-link/mobile-link.routes').then((m) => m.ROUTES),
  },
  {
    path: 'wl',
    loadChildren: () => import('./web-link/web-link.routes').then((m) => m.ROUTES),
  },
  {
    path: 'not-found',
    title: '404',
    loadComponent: () => import('./page-not-found.component').then((m) => m.PageNotFoundComponent),
  },
  {path: '**', redirectTo: '/not-found'},
];
