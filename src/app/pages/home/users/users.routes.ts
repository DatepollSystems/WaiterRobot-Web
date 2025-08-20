import {Routes} from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'all',
        loadComponent: () => import('./users.page').then((c) => c.UsersPage),
      },
      {
        path: ':id',
        loadComponent: () => import('./user-edit.page').then((c) => c.UserEditPage),
      },
      {path: '', pathMatch: 'full', redirectTo: 'all'},
    ],
  },
];
