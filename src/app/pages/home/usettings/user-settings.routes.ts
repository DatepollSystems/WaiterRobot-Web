import {Routes} from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'settings',
        loadComponent: () => import('./user-settings.page').then((c) => c.UserSettingsPage),
      },
      {
        path: 'sessions',
        title: 'NAV_USER_SESSIONS',
        loadComponent: () => import('./sessions.page').then((c) => c.SessionsPage),
      },
      {path: '', pathMatch: 'full', redirectTo: 'settings'},
    ],
  },
];
