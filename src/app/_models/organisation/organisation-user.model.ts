import {AEntityWithStringIDAndName} from 'dfx-helper';

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
