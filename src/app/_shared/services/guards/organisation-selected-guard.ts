import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {getLogMessage} from 'dfts-helper';
import {tap} from 'rxjs';
import {OrganisationsService} from '../../../home/organisations/_services/organisations.service';

export function organisationSelectedGuard() {
  const router = inject(Router);
  const organisationsService = inject(OrganisationsService);
  return organisationsService.getSelected$.pipe(
    tap((event) => {
      if (!event) {
        console.log(getLogMessage('LOG', 'organisationSelectedGuard', 'canActivate', 'No organisation selected; Routing to home'));
        return router.navigate(['/home']);
        return false;
      }
      return true;
    })
  );
}
