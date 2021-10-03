import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {AbstractModelEditComponent} from '../../../_helper/abstract-model-edit.component';
import {EventsService} from '../../../_services/events.service';
import {MyUserService} from '../../../_services/my-user.service';

import {EventModel} from '../../../_models/event.model';
import {UserModel} from '../../../_models/user.model';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.scss'],
})
export class EventEditComponent extends AbstractModelEditComponent<EventModel> {
  override onlyEditingTabs = [2];
  override redirectUrl = '/home/events/all';

  myUser: UserModel | undefined;
  selectedEvent!: EventModel | undefined;

  constructor(
    route: ActivatedRoute,
    router: Router,
    modal: NgbModal,
    protected eventsService: EventsService,
    private myUserService: MyUserService
  ) {
    super(route, router, eventsService, modal);

    this.myUser = this.myUserService.getUser();
    this.autoUnsubscribe(
      this.myUserService.userChange.subscribe((user) => {
        this.myUser = user;
      })
    );

    this.selectedEvent = this.eventsService.getSelected();
    this.autoUnsubscribe(
      this.eventsService.selectedChange.subscribe((value) => {
        this.selectedEvent = value;
      })
    );
  }

  onSelect(event: EventModel | undefined): void {
    this.eventsService.setSelected(event);
  }
}
