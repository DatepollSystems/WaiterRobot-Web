import {Component} from '@angular/core';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {AbstractModelsListComponent} from '../../../_helper/abstract-models-list.component';

import {EventModel} from '../../../_models/event.model';
import {ProductModel} from '../../../_models/product/product.model';

import {ProductsService} from '../../../_services/models/product/products.service';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.scss'],
})
export class AllProductsComponent extends AbstractModelsListComponent<ProductModel> {
  override columnsToDisplay = ['name', 'price', 'groupName', 'printer', 'allergens', 'actions'];

  selectedEvent: EventModel | undefined;

  constructor(protected entitiesService: ProductsService, modal: NgbModal) {
    super(modal, entitiesService);

    this.entitiesService.setSelectedEventGetAllUrl();
  }

  protected override initializeEntities(): void {
    this.entitiesService.setSelectedEventGetAllUrl();
    super.initializeEntities();
  }
}
