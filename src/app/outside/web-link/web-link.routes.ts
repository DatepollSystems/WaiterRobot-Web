import {Routes} from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 't/:publicId',
        loadComponent: () => import('./web-link-table.component').then((m) => m.WebLinkTableComponent),
      },
      {
        path: '**',
        redirectTo: '/not-found',
      },
    ],
  },
];
