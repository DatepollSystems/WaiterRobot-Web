import {Component} from '@angular/core';

import {AComponent} from 'dfx-helper';

import {EventsService} from '../../_services/models/events.service';
import {MyUserService} from '../../_services/auth/my-user.service';

import {EventModel} from '../../_models/event.model';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent extends AComponent {
  events: EventModel[];
  selectedEvent: EventModel | undefined;

  constructor(private myUserService: MyUserService, private eventsService: EventsService) {
    super();

    this.events = this.eventsService.getAll().slice(0, 5);
    this.autoUnsubscribe(
      this.eventsService.allChange.subscribe((value: EventModel[]) => {
        this.events = value.slice(0, 5);
      })
    );

    this.selectedEvent = this.eventsService.getSelected();
    this.autoUnsubscribe(
      this.eventsService.selectedChange.subscribe((value) => {
        this.selectedEvent = value;
      })
    );
  }
}
