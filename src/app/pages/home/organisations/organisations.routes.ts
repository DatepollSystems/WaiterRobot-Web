import {Routes} from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'all',
        loadComponent: () => import('./organisations.page').then((c) => c.OrganisationsPage),
      },
      {
        path: ':id',
        loadComponent: () => import('./organisation-edit.page').then((c) => c.OrganisationEditPage),
      },
      {path: '', pathMatch: 'full', redirectTo: 'all'},
    ],
  },
];
