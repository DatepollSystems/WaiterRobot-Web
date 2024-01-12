import {Routes} from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    children: [
      {path: 'all', loadComponent: () => import('./system-notifications.component').then((c) => c.SystemNotificationsComponent)},
      {
        path: ':id',
        loadComponent: () =>
          import('./system-notification-edit/system-notification-edit.component').then((c) => c.SystemNotificationEditComponent),
      },
      {path: '', pathMatch: 'full', redirectTo: 'all'},
    ],
  },
];
