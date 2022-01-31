import {Component} from '@angular/core';
import {Router} from '@angular/router';

import {AbstractModelsComponent} from '../../_helper/abstract-models.component';
import {ProductGroupsService} from '../../_services/models/product-groups.service';
import {ProductGroupModel} from '../../_models/product-group.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent extends AbstractModelsComponent<ProductGroupModel> {
  constructor(router: Router, service: ProductGroupsService) {
    super(router, service);
  }
}
