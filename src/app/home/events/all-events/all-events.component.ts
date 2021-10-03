import {Component} from '@angular/core';

import {Converter} from 'dfx-helper';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {AbstractModelsListComponent} from '../../../_helper/abstract-models-list.component';
import {EventsService} from '../../../_services/events.service';
import {MyUserService} from '../../../_services/my-user.service';

import {EventModel} from '../../../_models/event.model';
import {UserModel} from '../../../_models/user.model';

@Component({
  selector: 'app-all-events',
  templateUrl: './all-events.component.html',
  styleUrls: ['./all-events.component.scss'],
})
export class AllEventsComponent extends AbstractModelsListComponent<EventModel> {
  myUser: UserModel | undefined;

  constructor(modal: NgbModal, private myUserService: MyUserService, private eventsService: EventsService) {
    super(eventsService, modal);

    this.myUser = this.myUserService.getUser();
    this.autoUnsubscribe(
      this.myUserService.userChange.subscribe((user) => {
        this.myUser = user;
      })
    );
  }

  protected checkFilterForModel(filter: string, model: EventModel): EventModel | undefined {
    if (
      Converter.numberToString(model.id) === filter ||
      model.name.trim().toLowerCase().includes(filter) ||
      model.street.trim().toLowerCase().includes(filter) ||
      model.postal_code.trim().toLowerCase().includes(filter) ||
      model.city.trim().toLowerCase().includes(filter) ||
      model.date?.toString().trim().toLowerCase().includes(filter) ||
      model.street_number.trim().toLowerCase().includes(filter)
    ) {
      return model;
    }
    return undefined;
  }

  onSelect(event: EventModel): void {
    this.eventsService.setSelected(event);
  }
}
