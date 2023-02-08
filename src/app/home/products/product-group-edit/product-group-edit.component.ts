import {Component} from '@angular/core';
import {n_from} from 'dfts-helper';
import {AbstractModelEditComponent} from '../../../_shared/ui/abstract-model-edit.component';

import {EventModel} from '../../events/_models/event.model';

import {EventsService} from '../../events/_services/events.service';
import {PrinterModel} from '../../printers/_models/printer.model';
import {PrintersService} from '../../printers/_services/printers.service';
import {ProductGroupModel} from '../_models/product-group.model';
import {ProductGroupsService} from '../_services/product-groups.service';

@Component({
  selector: 'app-product-group-edit',
  templateUrl: './product-group-edit.component.html',
  styleUrls: ['./product-group-edit.component.scss'],
})
export class ProductGroupEditComponent extends AbstractModelEditComponent<ProductGroupModel> {
  override redirectUrl = '/home/products/groups/all';

  selectedEvent?: EventModel;
  printers: PrinterModel[];
  updatePrinter = false;

  constructor(groupsService: ProductGroupsService, printersService: PrintersService, eventsService: EventsService) {
    super(groupsService);

    this.selectedEvent = eventsService.getSelected();
    this.printers = printersService.getAll();
    this.unsubscribe(
      eventsService.getSelected$.subscribe((it) => (this.selectedEvent = it)),
      printersService.allChange.subscribe((it) => (this.printers = it))
    );
  }

  override addCustomAttributesBeforeCreateAndUpdate(model: any): any {
    model.eventId = this.selectedEvent?.id;
    if (this.updatePrinter) {
      model.printerId = n_from(model.printerId as string);
    } else {
      model.printerId = undefined;
    }
    return super.addCustomAttributesBeforeCreateAndUpdate(model);
  }
}
