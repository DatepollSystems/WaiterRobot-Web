import {AEntityWithNumberIDAndName, Converter} from 'dfx-helper';
import {
  GetOrderResponse,
  GetProductMinResponse,
  GetTableMinResponse,
  GetWaiterMinResponse,
  PrintState,
} from '../../../_shared/waiterrobot-backend';

export class OrderModel extends AEntityWithNumberIDAndName {
  public readonly orderId: number;
  public readonly table: GetTableMinResponse;
  public readonly product: GetProductMinResponse;
  public readonly waiter: GetWaiterMinResponse;
  public readonly note?: string;
  public readonly amount: number;
  public readonly printState: PrintState;

  constructor(data: GetOrderResponse) {
    super(data.id, Converter.toString(data.id), data);
    this.orderId = data.orderId;
    this.table = data.table;
    this.product = data.product;
    this.waiter = data.waiter;
    this.note = data.note;
    this.amount = data.amount;
    this.printState = data.printState;
  }
}
