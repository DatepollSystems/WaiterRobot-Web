import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {getLogMessage, o_fromStorage} from 'dfts-helper';

export function eventSelectedGuard() {
  const router = inject(Router);
  if (!o_fromStorage('selected_event')) {
    console.log(getLogMessage('LOG', 'eventSelectedGuard', 'canActivate', 'No event selected; Routing to home'));
    void router.navigate(['/home']);
    return false;
  }
  return true;
}
