import {Routes} from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'all',
        loadComponent: () => import('./tmp-notifications.page').then((c) => c.TmpNotificationsPage),
      },
      {
        path: 'view/:id',
        loadComponent: () => import('./tmp-notification-view.page').then((c) => c.TmpNotificationViewPage),
      },
      {path: '', pathMatch: 'full', redirectTo: 'all'},
    ],
  },
];
