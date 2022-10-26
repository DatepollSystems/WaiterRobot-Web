import {Component} from '@angular/core';
import {Router} from '@angular/router';

import {AbstractModelsComponent} from '../../_shared/ui/abstract-models.component';
import {ProductGroupModel} from './_models/product-group.model';
import {ProductGroupsService} from './_services/product-groups.service';

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
