import {AEntityWithNumberIDAndName} from 'dfx-helper';
import {GetUserResponse} from '../../../_shared/waiterrobot-backend';

export class UserModel extends AEntityWithNumberIDAndName {
  public readonly emailAddress: string;
  public readonly firstname: string;
  public readonly surname: string;
  public readonly birthday: string;
  public readonly activated: boolean;
  public readonly forcePasswordChange: boolean;
  public isAdmin: boolean;

  constructor(data: GetUserResponse) {
    super(data.id, data.firstname + ' ' + data.surname, data);
    this.emailAddress = data.emailAddress;
    this.firstname = data.firstname;
    this.surname = data.surname;
    this.birthday = data.birthday;
    this.activated = data.activated;
    this.forcePasswordChange = data.forcePasswordChange;
    this.isAdmin = data.role === 'ADMIN';
  }
}
