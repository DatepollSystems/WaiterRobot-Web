import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';

import {AuthService} from '@shared/services/auth/auth.service';

export const isAuthenticated = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  const authService = inject(AuthService);

  if (authService.isAuthenticated()) {
    return true;
  } else {
    authService.setRedirectUrl(state.url);

    void inject(Router).navigate(['/login']);
    return false;
  }
};
