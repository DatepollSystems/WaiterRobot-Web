import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {EventsService} from '../../../_services/models/events.service';
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

  selectedEvent: EventModel | undefined;

  constructor(
    route: ActivatedRoute,
    router: Router,
    groupsService: ProductGroupsService,
    modal: NgbModal,
    private eventsService: EventsService
  ) {
    super(router, route, modal, groupsService);

    this.selectedEvent = this.eventsService.getSelected();
    this.autoUnsubscribe(
      this.eventsService.selectedChange.subscribe((event) => {
        this.selectedEvent = event;
      })
    );
  }

  override addCustomAttributesBeforeCreateAndUpdate(model: any): any {
    model.event_id = this.selectedEvent?.id;
    return model;
  }
}
