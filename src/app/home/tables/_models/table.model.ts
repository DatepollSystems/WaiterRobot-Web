import {AEntityWithNumberIDAndName, s_from} from 'dfts-helper';
import {GetTableResponse} from '../../../_shared/waiterrobot-backend';

export class TableModel extends AEntityWithNumberIDAndName {
  public tableNumber: number;
  public seats: number;
  public groupId: number;
  public groupName: string;
  public eventId: number;

  constructor(data: GetTableResponse) {
    super(data.id, s_from(data.number), data);
    this.tableNumber = data.number;
    this.seats = data.seats;
    this.groupId = data.groupId;
    this.groupName = data.groupName;
    this.eventId = data.eventId;
  }
}
