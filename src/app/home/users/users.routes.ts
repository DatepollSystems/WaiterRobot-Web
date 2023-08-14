import {Routes} from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./users.component').then((c) => c.UsersComponent),
    children: [
      {path: 'all', loadComponent: () => import('./all-users.component').then((c) => c.AllUsersComponent)},
      {path: ':id', loadComponent: () => import('./user-edit/user-edit.component').then((c) => c.UserEditComponent)},
      {path: '', pathMatch: 'full', redirectTo: 'all'},
    ],
  },
];
