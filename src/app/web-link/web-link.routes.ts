import {Routes} from '@angular/router';

import {WebLinkComponent} from './web-link.component';

export const ROUTES: Routes = [
  {
    path: '',
    component: WebLinkComponent,
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
