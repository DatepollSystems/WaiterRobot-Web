import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {getLogMessage} from 'dfts-helper';
import {map} from 'rxjs';
import {EventsService} from '../../../home/events/_services/events.service';

export function eventSelectedGuard() {
  const router = inject(Router);
  const eventService = inject(EventsService);
  return eventService.getSelected$.pipe(
    map((event) => {
      if (!event) {
        console.log(getLogMessage('LOG', 'eventSelectedGuard', 'canActivate', 'No event selected; Routing to home'), event);
        void router.navigate(['/home']);
        return false;
      }
      return true;
    })
  );
}
