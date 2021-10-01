import {Component} from '@angular/core';

import {AbstractComponent} from '../../_helper/abstract-component';
import {EventsService} from '../../_services/events.service';
import {MyUserService} from '../../_services/myUser.service';

import {EventModel} from '../../_models/event.model';
import {UserModel} from '../../_models/user.model';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent extends AbstractComponent {
  myUser: UserModel | null = null;
  events: EventModel[];
  selectedEvent: EventModel | undefined;

  constructor(private myUserService: MyUserService, private eventsService: EventsService) {
    super();

    this.myUser = this.myUserService.getUser();
    this.autoUnsubscribe(
      this.myUserService.userChange.subscribe((user) => {
        this.myUser = user;
      })
    );

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
