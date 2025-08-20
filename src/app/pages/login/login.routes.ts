import {Routes} from '@angular/router';

import {isNotAuthenticated} from '../../guards/is-not-authenticated.guard';

export const ROUTES: Routes = [
  {
    path: '',
    canActivate: [isNotAuthenticated],
    loadComponent: () => import('./login.page').then((c) => c.LoginPage),
  },
  {
    path: 'forgot-password',
    canActivate: [isNotAuthenticated],
    loadComponent: () => import('./forgot-password.page').then((c) => c.ForgotPasswordPage),
  },
];
