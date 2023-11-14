import {Routes} from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./printers.component').then((c) => c.PrintersComponent),
    children: [
      {
        path: 'mediators',
        loadComponent: () => import('./all-mediators.component').then((c) => c.AllMediatorsComponent),
      },
      {
        path: 'printers',
        loadComponent: () => import('./all-printers/all-printers.component').then((c) => c.AllPrintersComponent),
      },
      {
        path: ':id',
        loadComponent: () => import('./printer-edit/printer-edit.component').then((c) => c.PrinterEditComponent),
      },
      {path: '', pathMatch: 'full', redirectTo: 'printers'},
    ],
  },
];
