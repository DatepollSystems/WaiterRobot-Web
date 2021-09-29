import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {Converter, TypeHelper} from 'dfx-helper';
import {Subscription} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {WaitersService} from '../../../_services/waiters.service';
import {EventsService} from '../../../_services/events.service';

import {EventModel} from '../../../_models/event.model';
import {WaiterModel} from '../../../_models/waiter.model';

import {AbstractModelsListComponent} from '../../../_helper/abstract-models-list.component';
import {WaiterQRCodeModal} from '../waiter-qr-code-modal.component';

@Component({
  selector: 'app-event-by-id-waiters',
  templateUrl: './event-by-id-waiters.component.html',
  styleUrls: ['./event-by-id-waiters.component.scss'],
})
export class EventByIdWaitersComponent extends AbstractModelsListComponent<WaiterModel> {
  event: EventModel | undefined;
  eventSubscription!: Subscription;

  constructor(
    waitersService: WaitersService,
    private eventsService: EventsService,
    private route: ActivatedRoute,
    private router: Router,
    modal: NgbModal
  ) {
    super(waitersService, modal);

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id != null) {
        if (TypeHelper.isNumeric(id)) {
          const nId = Converter.stringToNumber(id);
          this.lumber.info('const', 'Model to open: ' + nId);
          this.event = this.eventsService.getSingle(nId);
          if (this.event?.id == nId) {
            this.initializeVariables();
          }
          this.eventSubscription = this.eventsService.singleChange.subscribe((value) => {
            this.event = value;
            this.initializeVariables();
          });
        } else {
          // ERROR
          this.router.navigateByUrl('/home').then();
        }
      } else {
        // ERROR
        this.router.navigateByUrl('/home').then();
      }
    });
  }

  protected override initializeVariables() {
    if (!this.event) {
      return;
    }
    // TODO: Change to event_id
    this.modelService.setGetAllUrl('/config/waiter?organisation_id=' + this.event.id);
    super.initializeVariables();
  }

  protected override checkFilterForModel(filter: string, model: WaiterModel): WaiterModel | undefined {
    if (Converter.numberToString(model.id) === filter || model.name.trim().toLowerCase().includes(filter)) {
      return model;
    }
    return undefined;
  }

  public openQRCode(waiter: WaiterModel) {
    const modalRef = this.modal.open(WaiterQRCodeModal, {ariaLabelledBy: 'modal-qrcode-title', size: 'lg'});
    modalRef.componentInstance.waiter = waiter;
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    // TODO: this.waitersService.clearAll();
    this.eventSubscription.unsubscribe();
  }
}
