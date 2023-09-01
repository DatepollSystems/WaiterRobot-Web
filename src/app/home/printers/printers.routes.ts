import {Routes} from '@angular/router';

import {eventSelectedGuard} from '../../_shared/services/guards/event-selected-guard';
import {organisationSelectedGuard} from '../../_shared/services/guards/organisation-selected-guard';

export const ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./printers.component').then((c) => c.PrintersComponent),
    canActivate: [organisationSelectedGuard],
    children: [
      {
        path: 'mediators',
        loadComponent: () => import('./all-mediators.component').then((c) => c.AllMediatorsComponent),
      },
      {
        path: 'printers',
        loadComponent: () => import('./all-printers/all-printers.component').then((c) => c.AllPrintersComponent),
        canActivate: [eventSelectedGuard],
      },
      {
        path: ':id',
        loadComponent: () => import('./printer-edit/printer-edit.component').then((c) => c.PrinterEditComponent),
        canActivate: [eventSelectedGuard],
      },
      {path: '', pathMatch: 'full', redirectTo: 'printers'},
    ],
  },
];
