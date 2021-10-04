import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {WaitersService} from '../../../_services/waiters.service';
import {EventsService} from '../../../_services/events.service';

import {EventModel} from '../../../_models/event.model';
import {WaiterModel} from '../../../_models/waiter.model';

import {WaiterQRCodeModal} from '../waiter-qr-code-modal.component';
import {AbstractModelsListComponentById} from '../../../_helper/abstract-models-list-by-id.component';

@Component({
  selector: 'app-event-by-id-waiters',
  templateUrl: './event-by-id-waiters.component.html',
  styleUrls: ['./event-by-id-waiters.component.scss'],
})
export class EventByIdWaitersComponent extends AbstractModelsListComponentById<WaiterModel, EventModel> {
  // TODO: Change to event_id
  override getAllUrl = '/config/waiter?organisation_id=';

  constructor(waitersService: WaitersService, eventsService: EventsService, route: ActivatedRoute, router: Router, modal: NgbModal) {
    super(waitersService, modal, route, router, eventsService);
  }

  protected override checkFilterForModel(filter: string, model: WaiterModel): WaiterModel | undefined {
    if (model.name.trim().toLowerCase().includes(filter)) {
      return model;
    }
    return undefined;
  }

  public openQRCode(waiter: WaiterModel) {
    const modalRef = this.modal.open(WaiterQRCodeModal, {ariaLabelledBy: 'modal-qrcode-title', size: 'lg'});
    modalRef.componentInstance.waiter = waiter;
  }
}
