import {Routes} from '@angular/router';

import {MobileLinkComponent} from './mobile-link.component';

export const ROUTES: Routes = [
  {
    path: '',
    component: MobileLinkComponent,
    children: [
      {
        path: '**',
        loadComponent: () => import('./mobile-link-home.component').then((m) => m.MobileLinkHomeComponent),
      },
    ],
  },
];
