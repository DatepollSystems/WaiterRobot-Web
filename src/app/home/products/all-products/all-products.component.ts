import {Component} from '@angular/core';
import {AbstractModelsListComponentV2} from '../../../_shared/ui/abstract-models-list.component-v2';
import {GetAllergenResponse, GetProductMaxResponse} from '../../../_shared/waiterrobot-backend';

import {ProductsServiceV2} from '../_services/products.service';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
})
export class AllProductsComponent extends AbstractModelsListComponentV2<GetProductMaxResponse> {
  override columnsToDisplay = ['name', 'price', 'soldOut', 'groupName', 'printer', 'allergens', 'actions'];

  constructor(entitiesService: ProductsServiceV2) {
    super(entitiesService);

    this.setSelectable();
  }

  onMap = (it: GetAllergenResponse): string => it.shortName;
}
