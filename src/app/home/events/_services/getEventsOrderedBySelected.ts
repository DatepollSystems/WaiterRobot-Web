import {inject} from '@angular/core';
import {getOrderBySelected} from '../../../_shared/services/getOrderBySelected';
import {EventsService} from './events.service';
import {Observable} from 'rxjs';
import {GetEventOrLocationResponse} from '../../../_shared/waiterrobot-backend';

export function getEventsOrderedBySelected(): Observable<GetEventOrLocationResponse[]> {
  const eventsService = inject(EventsService);

  return getOrderBySelected(eventsService);
}
