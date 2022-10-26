import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AbstractModelsListByIdComponent} from '../../../_shared/ui/abstract-models-list-by-id.component';

import {EventModel} from '../../events/_models/event.model';
import {WaiterModel} from '../_models/waiter.model';
import {GetEventOrLocationMinResponse} from '../../../_shared/waiterrobot-backend';
import {EventsService} from '../../events/_services/events.service';

import {WaitersService} from '../_services/waiters.service';

import {WaiterCreateQRCodeModalComponent} from '../waiter-create-qr-code-modal.component';

@Component({
  selector: 'app-event-by-id-waiters',
  templateUrl: './event-by-id-waiters.component.html',
  styleUrls: ['./event-by-id-waiters.component.scss'],
})
export class EventByIdWaitersComponent extends AbstractModelsListByIdComponent<WaiterModel, EventModel> {
  override columnsToDisplay = ['name', 'activated', 'events', 'actions'];
  override getAllParam = 'eventId';

  constructor(waitersService: WaitersService, eventsService: EventsService, route: ActivatedRoute, router: Router, modal: NgbModal) {
    super(router, route, modal, waitersService, eventsService);

    this.setSelectable();
  }

  openQRCode(event: EventModel | undefined): void {
    if (!event) {
      return;
    }

    const modalRef = this.modal.open(WaiterCreateQRCodeModalComponent, {
      ariaLabelledBy: 'modal-qrcode-title',
      size: 'lg',
    });

    modalRef.componentInstance.name = event.name;
    modalRef.componentInstance.token = event.waiterCreateToken;
  }

  onMap = (it: GetEventOrLocationMinResponse) => it.name;
}
