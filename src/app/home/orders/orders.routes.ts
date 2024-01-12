import {Routes} from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    children: [
      {path: 'all', loadComponent: () => import('./orders/orders.component').then((c) => c.OrdersComponent)},
      {path: ':id', loadComponent: () => import('./order-info.component').then((c) => c.OrderInfoComponent)},
      {path: '', pathMatch: 'full', redirectTo: 'all'},
    ],
  },
];
