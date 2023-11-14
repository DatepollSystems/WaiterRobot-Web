import {Routes} from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./bills.component').then((c) => c.BillsComponent),
    children: [
      {path: 'all', loadComponent: () => import('./all-bills.component').then((c) => c.AllBillsComponent)},
      {path: 'unpaidReasons', loadComponent: () => import('./all-unpaid-reasons.component').then((c) => c.AllUnpaidReasonsComponent)},
      {path: ':id', loadComponent: () => import('./bill-info.component').then((c) => c.BillInfoComponent)},
      {path: '', pathMatch: 'full', redirectTo: 'all'},
    ],
  },
];
