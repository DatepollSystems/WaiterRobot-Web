import {AEntityWithNumberIDAndName, Converter} from 'dfx-helper';

export class TableModel extends AEntityWithNumberIDAndName {
  public tableNumber: number;
  public seats: number;
  public group_id: number;
  public group_name: string | undefined;
  public event_id: number;

  constructor(data: any) {
    super(data.id as number, Converter.toString(data.number as number), data);
    this.tableNumber = data.number;
    this.seats = data.seats;
    this.group_id = data.group_id;
    this.group_name = data.group_name;
    this.event_id = data.event_id;
  }
}
