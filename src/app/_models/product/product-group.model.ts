import {AEntityWithNumberIDAndName} from 'dfx-helper';

export class ProductGroupModel extends AEntityWithNumberIDAndName {
  public printerId: number;
  public eventId: number;

  constructor(data: any) {
    super(data.id, data.name, data);
    this.printerId = data.printerId;
    this.eventId = data.eventId;
  }
}
