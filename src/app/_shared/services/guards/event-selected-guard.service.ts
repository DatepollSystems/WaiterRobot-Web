import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {loggerOf} from 'dfts-helper';
import {EventsService} from '../../../home/events/_services/events.service';

@Injectable({
  providedIn: 'root',
})
export class EventSelectedGuard implements CanActivate {
  lumber = loggerOf('EventSelectedGuard');

  constructor(private eventService: EventsService, private router: Router) {}

  canActivate(): boolean {
    if (!this.eventService.getSelected()) {
      this.lumber.warning('canActivate', 'No event selected; Routing to home');
      void this.router.navigate(['/home']);
      return false;
    } else {
      return true;
    }
  }
}
