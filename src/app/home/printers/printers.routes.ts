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
            loadComponent: () => import('./mediators.component').then((c) => c.MediatorsComponent),
          },
        ],
      },
      {
        path: 'all',
        loadComponent: () => import('./printers.component').then((c) => c.PrintersComponent),
      },
      {
        path: ':id',
        loadComponent: () => import('./printer-edit/printer-edit.component').then((c) => c.PrinterEditComponent),
      },
      {path: '', pathMatch: 'full', redirectTo: 'all'},
    ],
  },
];
