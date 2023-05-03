import {Routes} from '@angular/router';

import {organisationSelectedGuard} from '../../_shared/services/guards/organisation-selected-guard';

export const ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./waiters.component').then((c) => c.WaitersComponent),
    canActivate: [organisationSelectedGuard],
    children: [
      {path: 'organisation', loadComponent: () => import('./organisation-waiters.component').then((c) => c.OrganisationWaitersComponent)},
      {
        path: 'organisation/duplicates',
        loadComponent: () =>
          import('./duplicate-organisation-waiters/duplicate-organisation-waiters.component').then(
            (c) => c.DuplicateOrganisationWaitersComponent
          ),
      },
      {
        path: 'organisation/duplicates/:name',
        loadComponent: () =>
          import('./duplicate-organisation-waiters/duplicate-organisation-waiters.component').then(
            (c) => c.DuplicateOrganisationWaitersComponent
          ),
      },
      {path: 'event/:id', loadComponent: () => import('./event-by-id-waiters.component').then((c) => c.EventByIdWaitersComponent)},
      {path: ':id', loadComponent: () => import('./waiter-edit/waiter-edit.component').then((c) => c.WaiterEditComponent)},
      {path: '', pathMatch: 'full', redirectTo: '/home/waiters/organisation'},
    ],
  },
];
