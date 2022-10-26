import {AEntityWithNumberIDAndName} from 'dfx-helper';
import {GetOrganisationResponse} from '../../../_shared/waiterrobot-backend';

export class OrganisationModel extends AEntityWithNumberIDAndName {
  public readonly street: string;
  public readonly streetNumber: string;
  public readonly postalCode: string;
  public readonly city: string;
  public readonly countryCode: string;

  constructor(data: GetOrganisationResponse) {
    super(data.id, data.name, data);
    this.street = data.street;
    this.streetNumber = data.streetNumber;
    this.postalCode = data.postalCode;
    this.city = data.city;
    this.countryCode = data.countryCode;
  }
}
