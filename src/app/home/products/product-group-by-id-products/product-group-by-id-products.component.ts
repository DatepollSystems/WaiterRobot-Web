import {Component} from '@angular/core';
import {AbstractModelsListByIdComponentV2} from '../../../_shared/ui/abstract-models-list-by-id.component-v2';
import {GetAllergenResponse, GetProductGroupResponse, GetProductMaxResponse} from '../../../_shared/waiterrobot-backend';
import {ProductGroupsService} from '../_services/product-groups.service';

import {ProductsServiceV2} from '../_services/products.service';

@Component({
  selector: 'app-product-group-by-id-products',
  templateUrl: './product-group-by-id-products.component.html',
})
export class ProductGroupByIdProductsComponent extends AbstractModelsListByIdComponentV2<GetProductMaxResponse, GetProductGroupResponse> {
  override columnsToDisplay = ['name', 'price', 'soldOut', 'printer', 'allergens', 'actions'];

  constructor(service: ProductsServiceV2, groupsService: ProductGroupsService) {
    super(service, groupsService);

    this.setSelectable();
  }

  onMap = (it: GetAllergenResponse): string => it.shortName;
}
