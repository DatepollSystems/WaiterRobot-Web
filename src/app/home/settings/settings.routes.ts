import {Routes} from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./settings.component').then((m) => m.SettingsComponent),
  },
  {
    path: 'gdpr',
    loadComponent: () => import('./gdpr/gdpr-list').then((m) => m.GDPRList),
  },
];

export const EVENT_ROUTES: Routes = [
  {
    path: 'licenses',
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./licenses/licences.component').then((c) => c.LicencesComponent),
      },
      {
        path: ':id',
        loadComponent: () => import('./licenses/license-edit/license-edit.component').then((c) => c.LicenseEditComponent),
      },
      {
        path: 'new',
        loadComponent: () => import('./licenses/license-edit/license-edit.component').then((c) => c.LicenseEditComponent),
      },
    ],
  },
];
