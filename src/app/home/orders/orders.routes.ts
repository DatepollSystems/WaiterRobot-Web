import {Routes} from '@angular/router';

import {eventSelectedGuard} from '../../_shared/services/guards/event-selected-guard';

export const ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./orders.component').then((c) => c.OrdersComponent),
    canActivate: [eventSelectedGuard],
    children: [
      {path: 'all', loadComponent: () => import('./all-orders.component').then((c) => c.AllOrdersComponent)},
      {path: '', pathMatch: 'full', redirectTo: '/home/orders/all'},
    ],
  },
];
