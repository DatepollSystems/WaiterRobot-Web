import {AEntityWithNumberIDAndName, Converter} from 'dfx-helper';

export class TableModel extends AEntityWithNumberIDAndName {
  public tableNumber: number;
  public seats: number;
  public groupId: number;
  public groupName: string | undefined;
  public eventId: number;

  constructor(data: any) {
    super(data.id as number, Converter.toString(data.number as number), data);
    this.tableNumber = data.number;
    this.seats = data.seats;
    this.groupId = data.groupId;
    this.groupName = data.groupName;
    this.eventId = data.eventId;
  }
}
