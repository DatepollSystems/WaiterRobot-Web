import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Converter} from 'dfx-helper';
import {AbstractModelEditComponent} from '../../../_shared/ui/abstract-model-edit.component';

import {EventModel} from '../../events/_models/event.model';
import {PrinterModel} from '../../printers/_models/printer.model';
import {ProductGroupModel} from '../_models/product-group.model';

import {EventsService} from '../../events/_services/events.service';
import {PrintersService} from '../../printers/_services/printers.service';
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

  constructor(
    route: ActivatedRoute,
    router: Router,
    groupsService: ProductGroupsService,
    modal: NgbModal,
    printersService: PrintersService,
    eventsService: EventsService
  ) {
    super(router, route, modal, groupsService);

    this.selectedEvent = eventsService.getSelected();
    this.printers = printersService.getAll();
    this.unsubscribe(
      eventsService.selectedChange.subscribe((it) => (this.selectedEvent = it)),
      printersService.allChange.subscribe((it) => (this.printers = it))
    );
  }

  override addCustomAttributesBeforeCreateAndUpdate(model: any): any {
    model.eventId = this.selectedEvent?.id;
    console.log('test', model.printerId);
    if (this.updatePrinter) {
      model.printerId = Converter.toNumber(model.printerId as string);
    } else {
      model.printerId = undefined;
    }
    return super.addCustomAttributesBeforeCreateAndUpdate(model);
  }
}
