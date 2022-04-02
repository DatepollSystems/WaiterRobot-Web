import {AEntityWithNumberIDAndName} from 'dfx-helper';

export class TableGroupModel extends AEntityWithNumberIDAndName {
  public seats: number;
  public eventId: number;

  constructor(data: any) {
    super(data.id, data.name, data);
    this.seats = data.seats;
    this.eventId = data.eventId;
  }
}
