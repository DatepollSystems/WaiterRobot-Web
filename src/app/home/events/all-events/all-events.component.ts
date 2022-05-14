import {Component} from '@angular/core';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {AbstractModelsListComponent} from '../../../_helper/abstract-models-list.component';
import {EventsService} from '../../../_services/models/events.service';
import {MyUserService} from '../../../_services/auth/my-user.service';

import {EventModel} from '../../../_models/event.model';
import {UserModel} from '../../../_models/user/user.model';

@Component({
  selector: 'app-all-events',
  templateUrl: './all-events.component.html',
  styleUrls: ['./all-events.component.scss'],
})
export class AllEventsComponent extends AbstractModelsListComponent<EventModel> {
  override columnsToDisplay = ['name', 'date', 'street', 'streetNumber', 'postalCode', 'city', 'actions'];

  myUser: UserModel | undefined;
  selectedEvent: EventModel | undefined;

  constructor(modal: NgbModal, private myUserService: MyUserService, public eventsService: EventsService) {
    super(modal, eventsService);

    this.myUser = this.myUserService.getUser();
    this.autoUnsubscribe(
      this.myUserService.userChange.subscribe((user) => {
        this.myUser = user;
      })
    );

    this.selectedEvent = this.eventsService.getSelected();
    this.autoUnsubscribe(
      this.eventsService.selectedChange.subscribe((event) => {
        this.selectedEvent = event;
      })
    );
  }
}
