import {Routes} from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./orders.component').then((c) => c.OrdersComponent),
    children: [
      {path: 'all', loadComponent: () => import('./all-orders/all-orders.component').then((c) => c.AllOrdersComponent)},
      {path: ':id', loadComponent: () => import('./order-info.component').then((c) => c.OrderInfoComponent)},
      {path: '', pathMatch: 'full', redirectTo: 'all'},
    ],
  },
];
