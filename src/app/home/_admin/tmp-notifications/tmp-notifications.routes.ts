import {Routes} from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    children: [
      {path: 'all', loadComponent: () => import('./all-tmp-notifications.component').then((c) => c.AllTmpNotificationsComponent)},
      {
        path: 'view',
        loadComponent: () => import('./tmp-notification-view.component').then((c) => c.TmpNotificationViewComponent),
      },
      {path: '', pathMatch: 'full', redirectTo: 'all'},
    ],
  },
];
