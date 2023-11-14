import {Routes} from '@angular/router';

import {isNotAuthenticated} from '../_shared/services/auth/is-not-authenticated.guard';

export const ROUTES: Routes = [
  {
    path: '',
    canActivate: [isNotAuthenticated],
    loadComponent: () => import('./login.component').then((c) => c.LoginComponent),
  },
  {
    path: 'forgot-password',
    canActivate: [isNotAuthenticated],
    loadComponent: () => import('./forgot-password.component').then((c) => c.ForgotPasswordComponent),
  },
];
