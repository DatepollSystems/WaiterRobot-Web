import {inject} from '@angular/core';
import {getOrderBySelected} from '@home-shared/services/getOrderBySelected';

import {GetEventOrLocationResponse} from '@shared/waiterrobot-backend';

import {Observable} from 'rxjs';
import {EventsService} from './events.service';
import {SelectedEventService} from './selected-event.service';

export function getEventsOrderedBySelected(): Observable<GetEventOrLocationResponse[]> {
  const eventsService = inject(EventsService);
  const selectedEventsService = inject(SelectedEventService);

  return getOrderBySelected(selectedEventsService, eventsService);
}
