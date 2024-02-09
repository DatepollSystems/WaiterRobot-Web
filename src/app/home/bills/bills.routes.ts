import {Routes} from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./bills.layout').then((c) => c.BillsLayout),
    children: [
      {path: 'all', loadComponent: () => import('./bills.component').then((c) => c.BillsComponent)},
      {path: ':id', loadComponent: () => import('./bill-info.component').then((c) => c.BillInfoComponent)},
      {
        path: 'reasons',
        children: [{path: 'all', loadComponent: () => import('./all-unpaid-reasons.component').then((c) => c.AllUnpaidReasonsComponent)}],
      },
      {path: '', pathMatch: 'full', redirectTo: 'all'},
    ],
  },
];
