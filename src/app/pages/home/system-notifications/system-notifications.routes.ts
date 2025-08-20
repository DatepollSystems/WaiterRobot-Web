import {Routes} from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'all',
        loadComponent: () => import('./system-notifications.page').then((c) => c.SystemNotificationsPage),
      },
      {
        path: ':id',
        loadComponent: () => import('./system-notification-edit.page').then((c) => c.SystemNotificationEditPage),
      },
      {path: '', pathMatch: 'full', redirectTo: 'all'},
    ],
  },
];
