import {inject} from '@angular/core';

import {Observable} from 'rxjs';

import {getOrderBySelected} from '../../../_shared/services/getOrderBySelected';
import {GetEventOrLocationResponse} from '../../../_shared/waiterrobot-backend';
import {EventsService} from './events.service';
import {SelectedEventService} from './selected-event.service';

export function getEventsOrderedBySelected(): Observable<GetEventOrLocationResponse[]> {
  const eventsService = inject(EventsService);
  const selectedEventsService = inject(SelectedEventService);

  return getOrderBySelected(selectedEventsService, eventsService);
}
