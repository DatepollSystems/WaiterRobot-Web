import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {DateHelper} from 'dfx-helper';
import {MyUserModel} from 'src/app/_models/user/my-user.model';

import {AbstractModelEditComponent} from '../../../_helper/abstract-model-edit.component';

import {EventModel} from '../../../_models/event.model';
import {MyUserService} from '../../../_services/auth/my-user.service';

import {EventsService} from '../../../_services/models/events.service';
import {OrganisationsService} from '../../../_services/models/organisation/organisations.service';
import {WaiterCreateQRCodeModalComponent} from '../../waiters/waiter-create-qr-code-modal.component';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.scss'],
})
export class EventEditComponent extends AbstractModelEditComponent<EventModel> {
  override redirectUrl = '/home/events/all';

  myUser?: MyUserModel;
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

    this.myUser = myUserService.getUser();
    this.selectedEvent = this.eventsService.getSelected();

    this.unsubscribe(
      myUserService.userChange.subscribe((user) => {
        this.myUser = user;
      }),
      this.eventsService.selectedChange.subscribe((value) => {
        this.selectedEvent = value;
      })
    );
  }

  openQRCode(event: EventModel): void {
    const modalRef = this.modal.open(WaiterCreateQRCodeModalComponent, {
      ariaLabelledBy: 'modal-qrcode-title',
      size: 'lg',
    });

    modalRef.componentInstance.name = event.name;
    modalRef.componentInstance.token = event.waiterCreateToken;
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
