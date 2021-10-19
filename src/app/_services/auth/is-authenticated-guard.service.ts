import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class IsAuthenticatedGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      const mode = route.queryParams.mode;
      if (mode?.includes('preview')) {
        return true;
      }
      void this.router.navigate(['/home']);
      return false;
    } else {
      return true;
    }
  }
}
