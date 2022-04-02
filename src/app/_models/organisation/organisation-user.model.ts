import {AEntityWithStringIDAndName} from 'dfx-helper';
import {OrganisationUserResponse} from '../waiterrobot-backend';

export class OrganisationUserModel extends AEntityWithStringIDAndName {
  public readonly emailAddress: string;
  public readonly role: string;
  public readonly organisationId: number;

  constructor(data: OrganisationUserResponse) {
    super(data.emailAddress, data.firstname + ' ' + data.surname, data);
    this.emailAddress = data.emailAddress;
    this.role = data.role;
    this.organisationId = data.organisationId;
  }
}
