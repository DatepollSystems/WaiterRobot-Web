import {inject} from '@angular/core';
import {getOrderBySelected} from '../../../_shared/services/getOrderBySelected';
import {EventsService} from './events.service';

export function getEventsOrderedBySelected() {
  const eventsService = inject(EventsService);

  return getOrderBySelected(eventsService);
}
