import {inject} from '@angular/core';

import {Observable} from 'rxjs';

import {getOrderBySelected} from '../../../_shared/services/getOrderBySelected';
import {EventsService} from './events.service';
import {GetEventOrLocationResponse} from '../../../_shared/waiterrobot-backend';

export function getEventsOrderedBySelected(): Observable<GetEventOrLocationResponse[]> {
  const eventsService = inject(EventsService);

  return getOrderBySelected(eventsService);
}
