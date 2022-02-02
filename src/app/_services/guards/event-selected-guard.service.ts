import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {EventsService} from '../models/events.service';

@Injectable({
  providedIn: 'root',
})
export class EventSelectedGuardService implements CanActivate {
  constructor(private eventService: EventsService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.eventService.getSelected() == undefined) {
      void this.router.navigate(['/home']);
      return false;
    } else {
      return true;
    }
  }
}
