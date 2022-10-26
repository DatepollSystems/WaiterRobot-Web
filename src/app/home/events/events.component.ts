import {Component} from '@angular/core';

import {AComponent} from 'dfx-helper';

import {EventModel} from './_models/event.model';
import {MyUserService} from '../../_shared/services/auth/user/my-user.service';

import {EventsService} from './_services/events.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent extends AComponent {
  events: EventModel[];
  selectedEvent: EventModel | undefined;

  constructor(myUserService: MyUserService, eventsService: EventsService) {
    super();

    this.events = eventsService.getAll().slice(0, 5);
    this.selectedEvent = eventsService.getSelected();

    this.unsubscribe(
      eventsService.allChange.subscribe((it) => (this.events = it.slice(0, 5))),
      eventsService.selectedChange.subscribe((it) => (this.selectedEvent = it))
    );
  }
}
