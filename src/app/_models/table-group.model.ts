import {AbstractEntityWithName} from 'dfx-helper';

export class TableGroupModel extends AbstractEntityWithName<number> {
  public seats: number;
  public event_id: number;

  constructor(data: any) {
    super(data.id, data.name);
    this.seats = data.seats;
    this.event_id = data.event_id;
  }
}
