import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class IsAuthenticatedGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      const mode = route.queryParams.mode;
      if (mode?.includes('preview')) {
        return true;
      }
      this.router.navigate(['/home']).then();
      return false;
    } else {
      return true;
    }
  }
}
