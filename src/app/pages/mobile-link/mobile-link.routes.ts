import {Routes} from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '**',
        loadComponent: () => import('./mobile-link-home.component').then((m) => m.MobileLinkHomeComponent),
      },
    ],
  },
];
