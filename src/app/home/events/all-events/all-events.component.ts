import {Component} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Observable} from 'rxjs';

import {AbstractModelsListComponent} from '../../../_shared/ui/abstract-models-list.component';

import {EventsService} from '../_services/events.service';
import {MyUserService} from '../../../_shared/services/auth/user/my-user.service';
import {EventModel} from '../_models/event.model';
import {MyUserModel} from 'src/app/_shared/services/auth/user/my-user.model';

@Component({
  selector: 'app-all-events',
  templateUrl: './all-events.component.html',
  styleUrls: ['./all-events.component.scss'],
})
export class AllEventsComponent extends AbstractModelsListComponent<EventModel> {
  override columnsToDisplay = ['name', 'date', 'street', 'streetNumber', 'postalCode', 'city', 'actions'];

  myUser$: Observable<MyUserModel>;
  selectedEvent?: EventModel;

  constructor(modal: NgbModal, myUserService: MyUserService, public eventsService: EventsService) {
    super(modal, eventsService);

    this.setSelectable();

    this.myUser$ = myUserService.getUser$();
    this.selectedEvent = this.eventsService.getSelected();

    this.unsubscribe(this.eventsService.selectedChange.subscribe((it) => (this.selectedEvent = it)));
  }
}
