import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';

import {AuthService} from './auth.service';

export const isAuthenticated = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  const authService = inject(AuthService);

  if (authService.isAuthenticated()) {
    return true;
  } else {
    authService.redirectUrl = state.url;

    void inject(Router).navigate(['/about']);
    return false;
  }
};
