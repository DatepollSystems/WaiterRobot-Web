import {Routes} from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./system-notifications.component').then((c) => c.SystemNotificationsComponent),
    children: [
      {path: 'all', loadComponent: () => import('./all-system-notifications.component').then((c) => c.AllSystemNotificationsComponent)},
      {
        path: ':id',
        loadComponent: () =>
          import('./system-notification-edit/system-notification-edit.component').then((c) => c.SystemNotificationEditComponent),
      },
      {path: '', pathMatch: 'full', redirectTo: 'all'},
    ],
  },
];
