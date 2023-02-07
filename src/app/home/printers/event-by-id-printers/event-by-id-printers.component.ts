import {Component} from '@angular/core';

import {AbstractModelsListByIdComponent} from '../../../_shared/ui/abstract-models-list-by-id.component';

import {EventModel} from '../../events/_models/event.model';

import {EventsService} from '../../events/_services/events.service';
import {PrinterModel} from '../_models/printer.model';
import {PrintersService} from '../_services/printers.service';

@Component({
  selector: 'app-event-by-id-printers',
  templateUrl: './event-by-id-printers.component.html',
  styleUrls: ['./event-by-id-printers.component.scss'],
})
export class EventByIdPrintersComponent extends AbstractModelsListByIdComponent<PrinterModel, EventModel> {
  override columnsToDisplay = ['name', 'printerName', 'productGroups', 'actions'];
  override getAllParam = 'eventId';

  constructor(printersService: PrintersService, eventsService: EventsService) {
    super(printersService, eventsService);
  }
}
