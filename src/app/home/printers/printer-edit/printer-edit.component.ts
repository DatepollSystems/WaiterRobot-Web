import {Component} from '@angular/core';

import {AbstractModelEditComponent} from '../../../_shared/ui/abstract-model-edit.component';

import {EventModel} from '../../events/_models/event.model';

import {EventsService} from '../../events/_services/events.service';
import {PrinterModel} from '../_models/printer.model';
import {PrintersService} from '../_services/printers.service';

@Component({
  selector: 'app-printer-edit',
  templateUrl: './printer-edit.component.html',
  styleUrls: ['./printer-edit.component.scss'],
})
export class PrinterEditComponent extends AbstractModelEditComponent<PrinterModel> {
  override redirectUrl = '/home/printers/mediators';
  override onlyEditingTabs = [2];

  selectedEvent?: EventModel;
  events: EventModel[];

  constructor(printersService: PrintersService, eventsService: EventsService) {
    super(printersService);

    this.selectedEvent = eventsService.getSelected();
    this.events = eventsService.getAll();

    this.unsubscribe(
      eventsService.selectedChange.subscribe((it) => (this.selectedEvent = it)),
      eventsService.allChange.subscribe((it) => (this.events = it))
    );
  }

  override addCustomAttributesBeforeCreateAndUpdate(model: any): any {
    this.redirectUrl = '/home/printers/event/' + model.eventId;

    return super.addCustomAttributesBeforeCreateAndUpdate(model);
  }
}
