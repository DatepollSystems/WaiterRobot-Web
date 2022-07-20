import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {AbstractModelEditComponent} from '../../../_helper/abstract-model-edit.component';

import {EventModel} from '../../../_models/event.model';
import {PrinterModel} from '../../../_models/printer.model';

import {EventsService} from '../../../_services/models/events.service';
import {PrintersService} from '../../../_services/models/printers.service';

@Component({
  selector: 'app-printer-edit',
  templateUrl: './printer-edit.component.html',
  styleUrls: ['./printer-edit.component.scss'],
})
export class PrinterEditComponent extends AbstractModelEditComponent<PrinterModel> {
  override redirectUrl = '/home/printers/event/';
  override onlyEditingTabs = [2];

  selectedEvent?: EventModel;

  constructor(route: ActivatedRoute, router: Router, printersSerivce: PrintersService, modal: NgbModal, eventsService: EventsService) {
    super(router, route, modal, printersSerivce);

    this.selectedEvent = eventsService.getSelected();
    this.autoUnsubscribe(eventsService.selectedChange.subscribe((event) => (this.selectedEvent = event)));
  }

  override addCustomAttributesBeforeCreateAndUpdate(model: any): any {
    model.eventId = this.selectedEvent?.id;
    return model;
  }

  override goToRedirectUrl(): void {
    void this.router.navigateByUrl(this.redirectUrl + this.selectedEvent?.id);
  }
}
