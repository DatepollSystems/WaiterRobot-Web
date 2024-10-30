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
