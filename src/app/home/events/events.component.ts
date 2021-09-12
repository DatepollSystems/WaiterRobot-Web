import {Component, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';

import {EventsService} from '../../_services/events.service';
import {EventModel} from '../../_models/event.model';
import {UserModel} from '../../_models/user.model';
import {MyUserService} from '../../_services/myUser.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnDestroy {
  myUser: UserModel|null = null;
  myUserSubscription: Subscription;

  events: EventModel[];
  eventsSubscription: Subscription;

  selectedEvent: EventModel | undefined;
  selectedEventSubscription: Subscription;

  constructor(private myUserService: MyUserService, private eventsService: EventsService) {
    this.myUser = this.myUserService.getUser();
    this.myUserSubscription = this.myUserService.userChange.subscribe(user => {
      this.myUser = user;
    });

    this.events = this.eventsService.getAll().slice(0, 5);
    this.eventsSubscription = this.eventsService.allChange.subscribe((value: EventModel[]) => {
      this.events = value.slice(0, 5);
    });

    this.selectedEvent = this.eventsService.getSelected();
    this.selectedEventSubscription = this.eventsService.selectedChange.subscribe(value => {
      this.selectedEvent = value;
    });
  }

  ngOnDestroy(): void {
    this.myUserSubscription.unsubscribe();
    this.eventsSubscription.unsubscribe();
    this.selectedEventSubscription.unsubscribe();
  }

}
