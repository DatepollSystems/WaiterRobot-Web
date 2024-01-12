import {Routes} from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'all',
        loadComponent: () => import('./organisations.component').then((c) => c.OrganisationsComponent),
      },
      {
        path: ':id',
        loadComponent: () => import('./organisation-edit/organisation-edit.component').then((c) => c.OrganisationEditComponent),
      },
      {path: '', pathMatch: 'full', redirectTo: 'all'},
    ],
  },
];
