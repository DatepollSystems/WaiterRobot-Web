import {Routes} from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    children: [
      {path: 'all', loadComponent: () => import('./dead-letters.component').then((c) => c.DeadLettersComponent)},
      {
        path: ':id',
        loadComponent: () => import('./dead-letter-view.component').then((c) => c.DeadLetterViewComponent),
      },
      {path: '', pathMatch: 'full', redirectTo: 'all'},
    ],
  },
];
