import {Routes} from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./outside.layout').then((c) => c.OutsideLayout),
    children: [
      {path: 'login', loadChildren: () => import('./login/login.routes').then((m) => m.ROUTES)},
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
    ],
  },
];
