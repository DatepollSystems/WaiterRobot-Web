import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {WaitersService} from '../../../_services/models/waiters.service';
import {EventsService} from '../../../_services/models/events.service';

import {EventModel} from '../../../_models/event.model';
import {WaiterModel} from '../../../_models/waiter.model';

import {WaiterQRCodeModalComponent} from '../waiter-qr-code-modal.component';
import {AbstractModelsListByIdComponent} from '../../../_helper/abstract-models-list-by-id.component';

@Component({
  selector: 'app-event-by-id-waiters',
  templateUrl: './event-by-id-waiters.component.html',
  styleUrls: ['./event-by-id-waiters.component.scss'],
})
export class EventByIdWaitersComponent extends AbstractModelsListByIdComponent<WaiterModel, EventModel> {
  override columnsToDisplay = ['name', 'actions'];
  // TODO: Change to event_id
  override getAllUrl = '/config/waiter?organisation_id=';

  constructor(waitersService: WaitersService, eventsService: EventsService, route: ActivatedRoute, router: Router, modal: NgbModal) {
    super(waitersService, modal, route, router, eventsService);
  }

  public openQRCode(waiter: WaiterModel): void {
    const modalRef = this.modal.open(WaiterQRCodeModalComponent, {ariaLabelledBy: 'modal-qrcode-title', size: 'lg'});
    modalRef.componentInstance.waiter = waiter;
  }
}
