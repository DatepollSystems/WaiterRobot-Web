import {Routes} from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./user-settings.component').then((c) => c.UserSettingsComponent),
    children: [
      {
        path: 'settings',
        loadComponent: () => import('./user-settings-sub/user-settings-sub.component').then((c) => c.UserSettingsSubComponent),
      },
      {
        path: 'sessions',
        title: 'NAV_USER_SESSIONS',
        loadComponent: () => import('./sessions.component').then((c) => c.SessionsComponent),
      },
      {path: '', pathMatch: 'full', redirectTo: 'settings'},
    ],
  },
];
