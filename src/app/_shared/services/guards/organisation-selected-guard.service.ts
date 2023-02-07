import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {loggerOf} from 'dfts-helper';
import {OrganisationsService} from '../../../home/organisations/_services/organisations.service';

@Injectable({
  providedIn: 'root',
})
export class OrganisationSelectedGuard implements CanActivate {
  lumber = loggerOf('OrganisationSelectedGuard');

  constructor(private organisationService: OrganisationsService, private router: Router) {}

  canActivate(): boolean {
    if (!this.organisationService.getSelected()) {
      this.lumber.warning('canActivate', 'No organisation selected; Routing to home');
      void this.router.navigate(['/home']);
      return false;
    } else {
      return true;
    }
  }
}
