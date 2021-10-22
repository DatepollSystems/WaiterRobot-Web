import {AbstractEntityWithNumberIDAndName} from 'dfx-helper';

export class TableGroupModel extends AbstractEntityWithNumberIDAndName {
  public seats: number;
  public event_id: number;

  constructor(data: any) {
    super(data.id, data.name, data);
    this.seats = data.seats;
    this.event_id = data.event_id;
  }
}
