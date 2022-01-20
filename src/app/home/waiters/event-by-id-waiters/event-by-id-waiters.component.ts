import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {WaitersService} from '../../../_services/models/waiters.service';
import {EventsService} from '../../../_services/models/events.service';

import {EventModel} from '../../../_models/event.model';
import {WaiterModel} from '../../../_models/waiter.model';

import {WaiterQRCodeModalComponent} from '../waiter-qr-code-modal.component';
import {AbstractModelsListByIdComponent} from '../../../_helper/abstract-models-list-by-id.component';
import {QrCodeModel} from '../../../_shared/app-qr-code-modal/qr-code.model';

@Component({
  selector: 'app-event-by-id-waiters',
  templateUrl: './event-by-id-waiters.component.html',
  styleUrls: ['./event-by-id-waiters.component.scss'],
})
export class EventByIdWaitersComponent extends AbstractModelsListByIdComponent<WaiterModel, EventModel> {
  override columnsToDisplay = ['name', 'actions'];
  override getAllParam = 'event_id';

  constructor(waitersService: WaitersService, eventsService: EventsService, route: ActivatedRoute, router: Router, modal: NgbModal) {
    super(waitersService, modal, route, router, eventsService);
  }

  public openQRCode(event: EventModel | undefined): void {
    if (!event) {
      return;
    }

    const modalRef = this.modal.open(WaiterQRCodeModalComponent, {ariaLabelledBy: 'modal-qrcode-title', size: 'lg'});

    modalRef.componentInstance.name = event.name;
    modalRef.componentInstance.qrCodeModel = QrCodeModel.waiterCreate(event.waiter_create_token);
  }
}
