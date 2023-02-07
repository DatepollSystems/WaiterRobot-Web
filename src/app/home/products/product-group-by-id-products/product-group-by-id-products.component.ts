import {Component} from '@angular/core';
import {AbstractModelsListByIdComponent} from '../../../_shared/ui/abstract-models-list-by-id.component';
import {ProductGroupModel} from '../_models/product-group.model';

import {ProductModel} from '../_models/product.model';
import {ProductGroupsService} from '../_services/product-groups.service';

import {ProductsService} from '../_services/products.service';

@Component({
  selector: 'app-product-group-by-id-products',
  templateUrl: './product-group-by-id-products.component.html',
  styleUrls: ['./product-group-by-id-products.component.scss'],
})
export class ProductGroupByIdProductsComponent extends AbstractModelsListByIdComponent<ProductModel, ProductGroupModel> {
  override columnsToDisplay = ['name', 'price', 'soldOut', 'printer', 'allergens', 'actions'];
  override getAllParam = 'groupId';

  constructor(service: ProductsService, groupsService: ProductGroupsService) {
    super(service, groupsService);

    this.setSelectable();
  }
}
