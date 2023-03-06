import {Routes} from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./organisations.component').then((c) => c.OrganisationsComponent),
    children: [
      {
        path: 'all',
        loadComponent: () => import('./all-organisations.component').then((c) => c.AllOrganisationsComponent),
      },
      // {
      //   path: ':id',
      //   loadComponent: () => import('./organisation-edit/organisation-edit.component').then((c) => c.OrganisationEditComponent),
      // },
      {path: '', pathMatch: 'full', redirectTo: '/home/organisations/all'},
    ],
  },
];
