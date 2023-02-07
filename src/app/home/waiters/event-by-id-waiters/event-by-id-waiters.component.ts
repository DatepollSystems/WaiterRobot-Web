import {Component} from '@angular/core';
import {AbstractModelsListByIdComponent} from '../../../_shared/ui/abstract-models-list-by-id.component';

import {EventModel} from '../../events/_models/event.model';
import {EventsService} from '../../events/_services/events.service';
import {WaiterModel} from '../_models/waiter.model';

import {WaitersService} from '../_services/waiters.service';

@Component({
  selector: 'app-event-by-id-waiters',
  templateUrl: './event-by-id-waiters.component.html',
  styleUrls: ['./event-by-id-waiters.component.scss'],
})
export class EventByIdWaitersComponent extends AbstractModelsListByIdComponent<WaiterModel, EventModel> {
  override columnsToDisplay = ['name', 'activated', 'events', 'actions'];
  override getAllParam = 'eventId';

  constructor(waitersService: WaitersService, eventsService: EventsService) {
    super(waitersService, eventsService);

    this.setSelectable();
  }
}
