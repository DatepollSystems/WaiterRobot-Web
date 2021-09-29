import {AbstractEntityModelWithName} from './abstract-entity.model';

export class OrganisationModel extends AbstractEntityModelWithName {
  public readonly street: string;
  public readonly street_number: string;
  public readonly postal_code: string;
  public readonly city: string;
  public readonly country_code: string;

  constructor(data: any) {
    super(data.id, data.name);
    this.street = data.street;
    this.street_number = data.street_number;
    this.postal_code = data.postal_code;
    this.city = data.city;
    this.country_code = data.country_code;
  }
}
