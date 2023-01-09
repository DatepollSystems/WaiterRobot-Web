import {AEntityWithNumberIDAndName} from 'dfts-helper';
import {GetProductGroupResponse} from '../../../_shared/waiterrobot-backend';

export class ProductGroupModel extends AEntityWithNumberIDAndName {
  public eventId: number;

  constructor(data: GetProductGroupResponse) {
    super(data.id, data.name, data);
    this.eventId = data.eventId;
  }
}
