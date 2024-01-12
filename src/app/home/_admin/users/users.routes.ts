import {Routes} from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    children: [
      {path: 'all', loadComponent: () => import('./users.component').then((c) => c.UsersComponent)},
      {path: ':id', loadComponent: () => import('./user-edit/user-edit.component').then((c) => c.UserEditComponent)},
      {path: '', pathMatch: 'full', redirectTo: 'all'},
    ],
  },
];
