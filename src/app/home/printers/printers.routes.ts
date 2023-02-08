import {Routes} from '@angular/router';

import {organisationSelectedGuard} from '../../_shared/services/guards/organisation-selected-guard';

export const ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./printers.component').then((c) => c.PrintersComponent),
    canActivate: [organisationSelectedGuard],
    children: [
      {path: 'mediators', loadComponent: () => import('./all-mediators.component').then((c) => c.AllMediatorsComponent)},
      {path: 'event/:id', loadComponent: () => import('./event-by-id-printers.component').then((c) => c.EventByIdPrintersComponent)},
      {path: ':id', loadComponent: () => import('./printer-edit.component').then((c) => c.PrinterEditComponent)},
      {path: '', pathMatch: 'full', redirectTo: '/home/printers/mediators'},
    ],
  },
];
