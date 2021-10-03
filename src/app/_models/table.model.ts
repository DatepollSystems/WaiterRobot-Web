import {AbstractEntityWithName, Converter} from 'dfx-helper';

export class TableModel extends AbstractEntityWithName<number> {
  public number: number;
  public seats: number;
  public group_id: number;
  public group_name: string | undefined;
  public event_id: number;

  constructor(data: any) {
    super(data.id, Converter.numberToString(data.number));
    this.number = data.number;
    this.seats = data.seats;
    this.group_id = data.group_id;
    this.event_id = data.event_id;
  }
}
