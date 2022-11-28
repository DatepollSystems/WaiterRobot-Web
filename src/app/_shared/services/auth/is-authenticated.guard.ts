import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from './auth.service';

export const isAuthenticated = (): boolean => {
  if (inject(AuthService).isAuthenticated()) {
    return true;
  } else {
    void inject(Router).navigate(['/about']);
    return false;
  }
};
