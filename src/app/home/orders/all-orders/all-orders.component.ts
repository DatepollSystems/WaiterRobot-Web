import {Component} from '@angular/core';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AbstractModelsListComponent} from '../../../_helper/abstract-models-list.component';
import {OrderModel} from '../../../_models/order.model';
import {OrdersService} from '../../../_services/models/orders.service';

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.scss'],
})
export class AllOrdersComponent extends AbstractModelsListComponent<OrderModel> {
  override columnsToDisplay = ['id', 'orderId', 'table', 'product', 'waiter', 'note', 'amount', 'state'];

  constructor(ordersService: OrdersService, modal: NgbModal) {
    super(modal, ordersService);
  }
}
