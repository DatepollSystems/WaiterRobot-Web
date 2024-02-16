import {Routes} from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./waiters.layout').then((c) => c.WaitersLayout),
    children: [
      {path: 'all', loadComponent: () => import('./waiters.component').then((c) => c.WaitersComponent)},
      {
        path: 'duplicates',
        loadComponent: () =>
          import('./duplicate-organisation-waiters/duplicate-organisation-waiters.component').then(
            (c) => c.DuplicateOrganisationWaitersComponent,
          ),
      },
      {
        path: 'duplicates/merge/:name',
        loadComponent: () =>
          import('./duplicate-organisation-waiters/duplicate-organisation-waiters-edit.component').then(
            (c) => c.DuplicateOrganisationWaitersEditComponent,
          ),
      },
      {path: 'event/:id', loadComponent: () => import('./waiters-by-event.component').then((c) => c.WaitersByEventComponent)},
      {path: ':id', loadComponent: () => import('./waiter-edit/waiter-edit.component').then((c) => c.WaiterEditComponent)},
      {path: '', pathMatch: 'full', redirectTo: 'all'},
    ],
  },
];
