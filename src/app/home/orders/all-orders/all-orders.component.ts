import {Component} from '@angular/core';
import {AbstractModelsListComponent} from '../../../_shared/ui/abstract-models-list.component';
import {OrderModel} from '../_models/order.model';
import {OrdersService} from '../_services/orders.service';

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.scss'],
})
export class AllOrdersComponent extends AbstractModelsListComponent<OrderModel> {
  override columnsToDisplay = ['id', 'orderId', 'table', 'product', 'waiter', 'note', 'amount', 'printState'];

  constructor(ordersService: OrdersService) {
    super(ordersService);

    this.sortingDataAccessors = new Map();
    this.sortingDataAccessors.set('table', (it) => it.table.number);
    this.sortingDataAccessors.set('product', (it) => it.product.name);
    this.sortingDataAccessors.set('waiter', (it) => it.waiter.name);
  }

  trackBy = (index: number, t: OrderModel): number => t.id;
}
