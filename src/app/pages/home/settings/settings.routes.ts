import {Routes} from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./settings.page').then((m) => m.SettingsPage),
  },
  {
    path: 'gdpr',
    loadComponent: () => import('./gdpr.page').then((m) => m.GdprPage),
  },
];

export const EVENT_ROUTES: Routes = [
  {
    path: 'licenses',
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./licences.page').then((c) => c.LicencesPage),
      },
      {
        path: ':id',
        loadComponent: () => import('./license-edit.page').then((c) => c.LicenseEditPage),
      },
      {
        path: 'new',
        loadComponent: () => import('./license-edit.page').then((c) => c.LicenseEditPage),
      },
    ],
  },
];
