import {Routes} from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'all',
        loadComponent: () => import('./dead-letters.page').then((c) => c.DeadLettersPage),
      },
      {
        path: ':id',
        loadComponent: () => import('./dead-letter-view.page').then((c) => c.DeadLetterViewPage),
      },
      {path: '', pathMatch: 'full', redirectTo: 'all'},
    ],
  },
];
