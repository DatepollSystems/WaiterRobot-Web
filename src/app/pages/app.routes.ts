import {Routes} from '@angular/router';

import {isAuthenticated} from '../guards/is-authenticated.guard';

export const ROUTES: Routes = [
  {
    path: 'info',
    title: 'INFORMATION',
    loadChildren: () => import('./info/info.routes').then((m) => m.ROUTES),
  },
  {
    path: '',
    loadChildren: () => import('./home/home.routes').then((m) => m.ROUTES),
    canActivate: [isAuthenticated],
  },
  {
    path: '',
    loadComponent: () => import('./outside.layout').then((c) => c.OutsideLayout),
    children: [
      {
        path: 'login',
        loadChildren: () => import('./login/login.routes').then((m) => m.ROUTES),
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
        loadComponent: () => import('./page-not-found.page').then((m) => m.PageNotFoundPage),
      },
    ],
  },
  {
    path: 'maxi',
    loadChildren: () => import('./maxi/maxi.routes').then((m) => m.ROUTES),
  },
  {path: '**', redirectTo: '/not-found'},
];
