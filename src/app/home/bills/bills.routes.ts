import {Routes} from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    children: [
      {path: 'all', loadComponent: () => import('./bills.component').then((c) => c.BillsComponent)},
      {
        path: 'reasons',
        children: [
          {path: 'all', loadComponent: () => import('./unpaid-reasons.component').then((c) => c.UnpaidReasonsComponent)},
          {
            path: ':id',
            loadComponent: () => import('./unpaid-reason-edit/unpaid-reason-edit.component').then((c) => c.UnpaidReasonEditComponent),
          },
        ],
      },
      {path: ':id', loadComponent: () => import('./bill-info.component').then((c) => c.BillInfoComponent)},
      {path: '', pathMatch: 'full', redirectTo: 'all'},
    ],
  },
];
