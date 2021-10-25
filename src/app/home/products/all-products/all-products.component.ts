import {Component} from '@angular/core';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {ProductsService} from '../../../_services/products.service';
import {AbstractModelsListComponent} from '../../../_helper/abstract-models-list.component';
import {ProductsModel} from '../../../_models/products';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.scss'],
})
export class AllProductsComponent extends AbstractModelsListComponent<ProductsModel> {
  override columnsToDisplay = ['name', 'price', 'allergens', 'group_id', 'printer_id', 'actions'];

  constructor(productsService: ProductsService, modal: NgbModal) {
    super(productsService, modal);
  }
}
