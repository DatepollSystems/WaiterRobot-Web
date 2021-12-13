import {AEntityWithNumberIDAndName} from 'dfx-helper';

export class EventModel extends AEntityWithNumberIDAndName {
  public readonly date: string | null;
  public readonly street: string;
  public readonly street_number: string;
  public readonly postal_code: string;
  public readonly city: string;
  public readonly waiter_create_token: string;

  constructor(data: any) {
    super(data.id, data.name, data);
    this.street = data.street;
    this.street_number = data.street_number;
    this.postal_code = data.postal_code;
    this.city = data.city;
    this.date = data.date;
    this.waiter_create_token = data.waiter_create_token;
  }
}
