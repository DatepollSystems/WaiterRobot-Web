import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {DateHelper} from 'dfx-helper';
import {MyUserModel} from 'src/app/_shared/services/auth/user/my-user.model';
import {MyUserService} from '../../../_shared/services/auth/user/my-user.service';

import {AbstractModelEditComponent} from '../../../_shared/ui/abstract-model-edit.component';
import {OrganisationsService} from '../../organisations/_services/organisations.service';

import {EventModel} from '../_models/event.model';

import {EventsService} from '../_services/events.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.scss'],
})
export class EventEditComponent extends AbstractModelEditComponent<EventModel> {
  override redirectUrl = '/home/events/all';

  myUser$: Observable<MyUserModel>;
  selectedEvent?: EventModel;

  constructor(
    route: ActivatedRoute,
    router: Router,
    modal: NgbModal,
    public eventsService: EventsService,
    private organisationsService: OrganisationsService,
    myUserService: MyUserService
  ) {
    super(router, route, modal, eventsService);

    this.myUser$ = myUserService.getUser$();
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
    model.date = DateHelper.getFormatted(model.date as Date | null);

    return super.addCustomAttributesBeforeCreateAndUpdate(model);
  }
}
