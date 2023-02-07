import {Component, inject} from '@angular/core';
import {d_format} from 'dfts-helper';
import {MyUserService} from '../../../_shared/services/auth/user/my-user.service';

import {AbstractModelEditComponent} from '../../../_shared/ui/abstract-model-edit.component';
import {OrganisationsService} from '../../organisations/_services/organisations.service';

import {EventModel} from '../_models/event.model';

import {EventsService} from '../_services/events.service';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.scss'],
})
export class EventEditComponent extends AbstractModelEditComponent<EventModel> {
  override redirectUrl = '/home/events/all';

  myUser$ = inject(MyUserService).getUser$();
  selectedEvent?: EventModel;

  constructor(public eventsService: EventsService, private organisationsService: OrganisationsService) {
    super(eventsService);
    this.selectedEvent = this.eventsService.getSelected();

    this.unsubscribe(
      this.eventsService.selectedChange.subscribe((value) => {
        this.selectedEvent = value;
      })
    );
  }

  override addCustomAttributesBeforeCreateAndUpdate(model: any): any {
    model.organisationId = this.organisationsService.getSelected()?.id;
    if (model.updateWaiterCreateToken?.length === 0) {
      model.updateWaiterCreateToken = false;
    }
    model.date = d_format(model.date as Date | null);

    return super.addCustomAttributesBeforeCreateAndUpdate(model);
  }
}
