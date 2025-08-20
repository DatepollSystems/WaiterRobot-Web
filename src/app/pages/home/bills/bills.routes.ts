import {Routes} from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'all',
        loadComponent: () => import('./bills.page').then((c) => c.BillsPage),
      },
      {
        path: 'reasons',
        children: [
          {
            path: 'all',
            loadComponent: () => import('./unpaid-reasons.page').then((c) => c.UnpaidReasonsPage),
          },
          {
            path: ':id',
            loadComponent: () => import('./unpaid-reason-edit.page').then((c) => c.UnpaidReasonEditPage),
          },
        ],
      },
      {
        path: ':id',
        loadComponent: () => import('./bill-info.page').then((c) => c.BillInfoPage),
      },
      {path: '', pathMatch: 'full', redirectTo: 'all'},
    ],
  },
];
