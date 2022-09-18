import {AEntityWithNumberIDAndName, Converter} from 'dfx-helper';
import {GetTableResponse} from '../waiterrobot-backend';

export class TableModel extends AEntityWithNumberIDAndName {
  public tableNumber: number;
  public seats: number;
  public groupId: number;
  public groupName: string;
  public eventId: number;

  constructor(data: GetTableResponse) {
    super(data.id, Converter.toString(data.number), data);
    this.tableNumber = data.number;
    this.seats = data.seats;
    this.groupId = data.groupId;
    this.groupName = data.groupName;
    this.eventId = data.eventId;
  }
}
