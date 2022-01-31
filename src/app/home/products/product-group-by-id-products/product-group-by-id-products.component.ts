import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {ProductsService} from '../../../_services/models/products.service';
import {ProductGroupsService} from '../../../_services/models/product-groups.service';
import {AbstractModelsListByIdComponent} from '../../../_helper/abstract-models-list-by-id.component';

import {ProductModel} from '../../../_models/product.model';
import {ProductGroupModel} from '../../../_models/product-group.model';

@Component({
  selector: 'app-product-group-by-id-products',
  templateUrl: './product-group-by-id-products.component.html',
  styleUrls: ['./product-group-by-id-products.component.scss'],
})
export class ProductGroupByIdProductsComponent extends AbstractModelsListByIdComponent<ProductModel, ProductGroupModel> {
  override columnsToDisplay = ['name', 'allergens', 'actions'];
  override getAllParam = 'group_id';

  constructor(service: ProductsService, groupsService: ProductGroupsService, route: ActivatedRoute, router: Router, modal: NgbModal) {
    super(router, route, modal, service, groupsService);
  }
}
