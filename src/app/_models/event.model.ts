import {AEntityWithNumberIDAndName} from 'dfx-helper';

export class EventModel extends AEntityWithNumberIDAndName {
  public readonly date: string | null;
  public readonly street: string;
  public readonly streetNumber: string;
  public readonly postalCode: string;
  public readonly city: string;
  public readonly waiter_create_token: string;
  public readonly organisation_id: number;

  constructor(data: any) {
    super(data.id, data.name, data);
    this.street = data.street;
    this.streetNumber = data.street_number;
    this.postalCode = data.postal_code;
    this.city = data.city;
    this.date = data.date;
    this.waiter_create_token = data.waiter_create_token;
    this.organisation_id = data.organisation_id;
  }
}
