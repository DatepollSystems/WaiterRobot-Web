import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {StringHelper} from 'dfx-helper';

import {AbstractModelsListByIdComponent} from '../../../_helper/abstract-models-list-by-id.component';

import {EventModel} from '../../../_models/event.model';
import {PrinterModel} from '../../../_models/printer.model';
import {GetProductMinResponse} from '../../../_models/waiterrobot-backend';

import {EventsService} from '../../../_services/models/events.service';
import {PrintersService} from '../../../_services/models/printers.service';

@Component({
  selector: 'app-event-by-id-printers',
  templateUrl: './event-by-id-printers.component.html',
  styleUrls: ['./event-by-id-printers.component.scss'],
})
export class EventByIdPrintersComponent extends AbstractModelsListByIdComponent<PrinterModel, EventModel> {
  override columnsToDisplay = ['name', 'printerName', 'productGroups', 'actions'];
  override getAllParam = 'eventId';

  constructor(printersService: PrintersService, eventsService: EventsService, route: ActivatedRoute, router: Router, modal: NgbModal) {
    super(router, route, modal, printersService, eventsService);
  }

  onMap(products: GetProductMinResponse[]): string {
    return StringHelper.getImploded(
      products.map((pg) => pg.name),
      20
    );
  }
}
