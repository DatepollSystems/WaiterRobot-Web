import {Component} from '@angular/core';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AbstractModelsListComponent} from '../../../_helper/abstract-models-list.component';
import {ProductGroupModel} from '../../../_models/product/product-group.model';

import {ProductGroupsService} from '../../../_services/models/product/product-groups.service';

@Component({
  selector: 'app-product-groups',
  templateUrl: './product-groups.component.html',
  styleUrls: ['./product-groups.component.scss'],
})
export class ProductGroupsComponent extends AbstractModelsListComponent<ProductGroupModel> {
  override columnsToDisplay = ['name', 'actions'];

  constructor(groups: ProductGroupsService, modal: NgbModal) {
    super(modal, groups);
  }
}
