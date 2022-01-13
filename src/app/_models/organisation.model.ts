import {AEntityWithNumberIDAndName, AEntityWithStringIDAndName} from 'dfx-helper';

export class OrganisationModel extends AEntityWithNumberIDAndName {
  public readonly street: string;
  public readonly street_number: string;
  public readonly postal_code: string;
  public readonly city: string;
  public readonly country_code: string;

  constructor(data: any) {
    super(data.id, data.name, data);
    this.street = data.street;
    this.street_number = data.street_number;
    this.postal_code = data.postal_code;
    this.city = data.city;
    this.country_code = data.country_code;
  }
}

export class OrganisationUserModel extends AEntityWithStringIDAndName {
  public readonly email_address: string;
  public readonly role: string;
  public readonly organisation_id: number;

  constructor(data: any) {
    super(data.email_address, data.firstname + ' ' + data.surname, data);
    this.email_address = data.email_address;
    this.role = data.role;
    this.organisation_id = data.organisation_id;
  }
}
