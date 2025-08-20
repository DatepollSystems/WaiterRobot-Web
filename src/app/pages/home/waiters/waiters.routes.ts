import {Routes} from '@angular/router';

export const WAITER_ROUTES: Routes = [
  {
    path: ':id',
    loadComponent: () => import('./waiters.layout').then((c) => c.WaitersLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./waiters.page').then((c) => c.WaitersPage),
      },
    ],
  },
  {
    path: 'waiter/:id',
    loadComponent: () => import('./waiter-edit.page').then((c) => c.WaiterEditPage),
  },
  {path: '', pathMatch: 'full', redirectTo: 'all'},
];

export const WAITER_DUPLICATE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./duplicate-organisation-waiters.page').then((c) => c.DuplicateOrganisationWaitersPage),
  },
  {
    path: 'merge/:name',
    loadComponent: () => import('./duplicate-organisation-waiters-edit.page').then((c) => c.DuplicateOrganisationWaitersEditPage),
  },
];
