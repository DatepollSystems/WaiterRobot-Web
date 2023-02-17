import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {getLogMessage, o_fromStorage} from 'dfts-helper';
import {AuthService} from '../auth/auth.service';

export function organisationSelectedGuard(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  const router = inject(Router);
  if (!o_fromStorage('selected_org')) {
    console.log(getLogMessage('LOG', 'organisationSelectedGuard', 'canActivate', 'No organisation selected; Routing to home'));
    inject(AuthService).redirectUrl = state.url;
    void router.navigate(['/home/select']);
    return false;
  }
  return true;
}
