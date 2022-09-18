import {AEntityWithNumberIDAndName} from 'dfx-helper';
import {GetProductGroupResponse} from '../waiterrobot-backend';

export class ProductGroupModel extends AEntityWithNumberIDAndName {
  public eventId: number;

  constructor(data: GetProductGroupResponse) {
    super(data.id, data.name, data);
    this.eventId = data.eventId;
  }
}
