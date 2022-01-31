import {AEntityWithNumberIDAndName} from 'dfx-helper';

export class ProductGroupModel extends AEntityWithNumberIDAndName {
  public printer_id: number;
  public event_id: number;

  constructor(data: any) {
    super(data.id, data.name, data);
    this.printer_id = data.printer_id;
    this.event_id = data.event_id;
  }
}
