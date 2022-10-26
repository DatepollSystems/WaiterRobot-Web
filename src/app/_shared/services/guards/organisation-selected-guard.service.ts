import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {OrganisationsService} from '../../../home/organisations/_services/organisations.service';

@Injectable({
  providedIn: 'root',
})
export class OrganisationSelectedGuard implements CanActivate {
  constructor(private organisationService: OrganisationsService, private router: Router) {}

  canActivate(): boolean {
    if (!this.organisationService.getSelected()) {
      void this.router.navigate(['/home']);
      return false;
    } else {
      return true;
    }
  }
}
