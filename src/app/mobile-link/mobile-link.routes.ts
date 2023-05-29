import {Routes} from '@angular/router';
import {MobileLinkComponent} from './mobile-link.component';

export const ROUTES: Routes = [
  {
    path: '',
    component: MobileLinkComponent,
    children: [
      {
        path: 't/:publicId',
        loadComponent: () => import('./mobile-link-table.component').then((m) => m.MobileLinkTableComponent),
      },
      {
        path: '**',
        loadComponent: () => import('./mobile-link-home.component').then((m) => m.MobileLinkHomeComponent),
      },
    ],
  },
];
