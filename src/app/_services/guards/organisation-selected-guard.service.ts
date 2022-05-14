import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {OrganisationsService} from '../models/organisation/organisations.service';

@Injectable({
  providedIn: 'root',
})
export class OrganisationSelectedGuard implements CanActivate {
  constructor(private organisationService: OrganisationsService, private router: Router) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.organisationService.getSelected() == undefined) {
      void this.router.navigate(['/home']);
      return false;
    } else {
      return true;
    }
  }
}
