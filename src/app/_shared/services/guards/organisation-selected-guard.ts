import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {getLogMessage, o_fromStorage} from 'dfts-helper';

export function organisationSelectedGuard() {
  const router = inject(Router);
  if (!o_fromStorage('selected_org')) {
    console.log(getLogMessage('LOG', 'organisationSelectedGuard', 'canActivate', 'No organisation selected; Routing to home'));
    void router.navigate(['/home']);
    return false;
  }
  return true;
}
