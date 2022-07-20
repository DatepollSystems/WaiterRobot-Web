import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PrinterModel} from '../../../_models/printer.model';

import {EventsService} from '../../../_services/models/events.service';
import {PrintersService} from '../../../_services/models/printers.service';
import {ProductGroupsService} from '../../../_services/models/product/product-groups.service';
import {AbstractModelEditComponent} from '../../../_helper/abstract-model-edit.component';

import {EventModel} from '../../../_models/event.model';
import {ProductGroupModel} from '../../../_models/product/product-group.model';

@Component({
  selector: 'app-product-group-edit',
  templateUrl: './product-group-edit.component.html',
  styleUrls: ['./product-group-edit.component.scss'],
})
export class ProductGroupEditComponent extends AbstractModelEditComponent<ProductGroupModel> {
  override redirectUrl = '/home/products/groups/all';

  selectedEvent?: EventModel;
  printers: PrinterModel[];
  selectedPrinter?: number;

  constructor(
    route: ActivatedRoute,
    router: Router,
    groupsService: ProductGroupsService,
    modal: NgbModal,
    printersService: PrintersService,
    private eventsService: EventsService
  ) {
    super(router, route, modal, groupsService);

    this.selectedEvent = this.eventsService.getSelected();
    this.autoUnsubscribe(
      this.eventsService.selectedChange.subscribe((event) => {
        this.selectedEvent = event;
      })
    );

    this.printers = printersService.getAll();
    this.autoUnsubscribe(printersService.allChange.subscribe((printers) => (this.printers = printers)));
  }

  override addCustomAttributesBeforeCreateAndUpdate(model: any): any {
    model.eventId = this.selectedEvent?.id;
    return model;
  }
}
