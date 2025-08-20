import {Routes} from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./orders.layout').then((c) => c.OrdersLayout),
    children: [
      {
        path: 'all',
        loadComponent: () => import('./orders.page').then((c) => c.OrdersPage),
      },
      {
        path: ':id',
        loadComponent: () => import('./order-info.page').then((c) => c.OrderInfoPage),
      },
      {path: '', pathMatch: 'full', redirectTo: 'all'},
    ],
  },
];
