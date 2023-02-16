import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {getLogMessage, o_fromStorage} from 'dfts-helper';
import {AuthService} from '../auth/auth.service';

export function eventSelectedGuard(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  const router = inject(Router);
  if (!o_fromStorage('selected_event')) {
    console.log(getLogMessage('LOG', 'eventSelectedGuard', 'canActivate', 'No event selected; Routing to home'));
    inject(AuthService).redirectUrl = state.url;
    void router.navigate(['/home/select']);
    return false;
  }
  return true;
}
