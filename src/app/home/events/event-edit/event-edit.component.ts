import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {DateHelper} from 'dfx-helper';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {AbstractModelEditComponent} from '../../../_helper/abstract-model-edit.component';
import {WaiterCreateQRCodeModalComponent} from '../../waiters/waiter-create-qr-code-modal.component';

import {EventsService} from '../../../_services/models/events.service';
import {MyUserService} from '../../../_services/auth/my-user.service';
import {OrganisationsService} from '../../../_services/models/organisation/organisations.service';

import {EventModel} from '../../../_models/event.model';
import {UserModel} from '../../../_models/user/user.model';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.scss'],
})
export class EventEditComponent extends AbstractModelEditComponent<EventModel> {
  override onlyEditingTabs = [2];
  override redirectUrl = '/home/events/all';

  myUser: UserModel | undefined;
  selectedEvent: EventModel | undefined;

  constructor(
    route: ActivatedRoute,
    router: Router,
    modal: NgbModal,
    public eventsService: EventsService,
    private myUserService: MyUserService,
    private organisationsService: OrganisationsService
  ) {
    super(router, route, modal, eventsService);

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
    model.date = DateHelper.getDateFormatted(model.date);

    return super.addCustomAttributesBeforeCreateAndUpdate(model);
  }
}
