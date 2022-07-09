import {AEntityWithNumberIDAndName} from 'dfx-helper';
import {GetEventOrLocationResponse} from './waiterrobot-backend';

export class EventModel extends AEntityWithNumberIDAndName {
  public readonly date?: string;
  public readonly street: string;
  public readonly streetNumber: string;
  public readonly postalCode: string;
  public readonly city: string;
  public readonly waiterCreateToken: string;
  public readonly organisationId: number;

  constructor(data: GetEventOrLocationResponse) {
    super(data.id, data.name, data);
    this.street = data.street;
    this.streetNumber = data.streetNumber;
    this.postalCode = data.postalCode;
    this.city = data.city;
    this.date = data.date;
    this.waiterCreateToken = data.waiterCreateToken;
    this.organisationId = data.organisationId;
  }
}
