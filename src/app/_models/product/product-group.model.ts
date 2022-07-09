import {AEntityWithNumberIDAndName, Converter} from 'dfx-helper';
import {GetProductGroupResponse} from '../waiterrobot-backend';

export class ProductGroupModel extends AEntityWithNumberIDAndName {
  public printerId: number | undefined;
  public eventId: number;

  constructor(data: GetProductGroupResponse) {
    super(data.id, data.name, data);
    this.printerId = Converter.nullToUndefined(data.printerId);
    this.eventId = data.eventId;
  }
}
