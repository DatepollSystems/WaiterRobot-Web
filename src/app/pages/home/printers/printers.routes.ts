import {Routes} from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'mediators',
        children: [
          {
            path: 'all',
            loadComponent: () => import('./mediators.page').then((c) => c.MediatorsPage),
          },
        ],
      },
      {
        path: 'all',
        loadComponent: () => import('./printers.page').then((c) => c.PrintersPage),
      },
      {
        path: ':id',
        loadComponent: () => import('./printer-edit.page').then((c) => c.PrinterEditPage),
      },
      {path: '', pathMatch: 'full', redirectTo: 'all'},
    ],
  },
];
