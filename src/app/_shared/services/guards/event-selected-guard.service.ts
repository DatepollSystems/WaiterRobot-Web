import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {EventsService} from '../../../home/events/_services/events.service';

@Injectable({
  providedIn: 'root',
})
export class EventSelectedGuard implements CanActivate {
  constructor(private eventService: EventsService, private router: Router) {}

  canActivate(): boolean {
    if (!this.eventService.getSelected()) {
      void this.router.navigate(['/home']);
      return false;
    } else {
      return true;
    }
  }
}
