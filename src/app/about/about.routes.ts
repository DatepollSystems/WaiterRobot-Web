import {Routes} from '@angular/router';

import {isNotAuthenticated} from '../_shared/services/auth/is-not-authenticated.guard';

export const ROUTES: Routes = [
  {
    path: '',
    canActivate: [isNotAuthenticated],
    loadComponent: () => import('./about.component').then((c) => c.AboutComponent),
  },
  {
    path: 'forgot-password',
    canActivate: [isNotAuthenticated],
    loadComponent: () => import('./forgot-password.component').then((c) => c.ForgotPasswordComponent),
  },
];
