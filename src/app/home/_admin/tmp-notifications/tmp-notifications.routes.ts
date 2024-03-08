import {Routes} from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    children: [
      {path: 'all', loadComponent: () => import('./tmp-notifications.component').then((c) => c.TmpNotificationsComponent)},
      {
        path: 'view/:id',
        loadComponent: () => import('./tmp-notification-view.component').then((c) => c.TmpNotificationViewComponent),
      },
      {path: '', pathMatch: 'full', redirectTo: 'all'},
    ],
  },
];
