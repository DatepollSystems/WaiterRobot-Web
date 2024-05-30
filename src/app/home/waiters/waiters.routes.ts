import {Routes} from '@angular/router';

export const WAITER_ROUTES: Routes = [
  {
    path: ':id',
    loadComponent: () => import('./waiters.layout').then((c) => c.WaitersLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./waiters.component').then((c) => c.WaitersComponent),
      },
    ],
  },
  {path: 'waiter/:id', loadComponent: () => import('./waiter-edit/waiter-edit.component').then((c) => c.WaiterEditComponent)},
  {path: '', pathMatch: 'full', redirectTo: 'all'},
];

export const WAITER_DUPLICATE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./duplicate-organisation-waiters/duplicate-organisation-waiters.component').then(
        (c) => c.DuplicateOrganisationWaitersComponent,
      ),
  },
  {
    path: 'merge/:name',
    loadComponent: () =>
      import('./duplicate-organisation-waiters/duplicate-organisation-waiters-edit.component').then(
        (c) => c.DuplicateOrganisationWaitersEditComponent,
      ),
  },
];
