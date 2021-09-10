import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';

import {EventsService} from '../../../_services/events.service';
import {EventModel} from '../../../_models/event.model';
import {UserModel} from '../../../_models/user.model';
import {MyUserService} from '../../../_services/myUser.service';
import {AModelEditComponent} from '../../../_helper/a-model-edit.component';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.scss']
})
export class EventEditComponent extends AModelEditComponent<EventModel>{
  override onlyEditingTabs = [2];
  override redirectUrl = '/home/events/all'

  myUser: UserModel|null = null;
  myUserSubscription: Subscription;

  selectedEvent!: EventModel | null;
  selectedEventSubscription: Subscription | undefined;

  constructor(route: ActivatedRoute,
              router: Router,
              protected eventsService: EventsService,
              private myUserService: MyUserService) {
    super(route, router, eventsService);

    this.myUser = this.myUserService.getUser();
    this.myUserSubscription = this.myUserService.userChange.subscribe(user => {
      this.myUser = user;
    });

    this.selectedEvent = this.eventsService.getSelected();
    this.selectedEventSubscription = this.eventsService.selectedChange.subscribe(value => {
      this.selectedEvent = value;
    });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.myUserSubscription.unsubscribe();
    this.selectedEventSubscription?.unsubscribe();
  }

  onSelect(event: EventModel | null) {
    this.eventsService.setSelected(event);
  }
}
