import {Routes} from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dead-letters.component').then((c) => c.DeadLettersComponent),
    children: [
      {path: 'all', loadComponent: () => import('./all-dead-letters.component').then((c) => c.AllDeadLettersComponent)},
      {
        path: ':id',
        loadComponent: () => import('./dead-letter-view.component').then((c) => c.DeadLetterViewComponent),
      },
      {path: '', pathMatch: 'full', redirectTo: 'all'},
    ],
  },
];
