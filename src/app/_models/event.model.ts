import {AModel} from 'dfx-helper';

export class EventModel extends AModel {
  public readonly name: string;
  public readonly date: Date|null;
  public readonly street: string;
  public readonly street_number: string;
  public readonly postal_code: string;
  public readonly city: string;

  constructor(data: any) {
    super(data.id);
    this.name = data.name;
    this.street = data.street;
    this.street_number = data.street_number;
    this.postal_code = data.postal_code;
    this.city = data.city;
    if (data.date == null) {
      this.date = null;
    } else {
      this.date = new Date(data.date);
    }
  }
}
