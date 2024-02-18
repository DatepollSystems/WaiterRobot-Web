import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, Router} from '@angular/router';

import {AuthService} from '@shared/services/auth/auth.service';

export const isNotAuthenticated = (route: ActivatedRouteSnapshot): boolean => {
  if (inject(AuthService).isAuthenticated()) {
    if (route.queryParams.mode?.includes('preview') || route.queryParams.preview !== undefined) {
      return true;
    }
    void inject(Router).navigate(['/']);
    return false;
  } else {
    return true;
  }
};
