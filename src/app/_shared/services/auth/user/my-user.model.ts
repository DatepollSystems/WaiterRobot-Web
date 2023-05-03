import {AEntityWithNumberIDAndName} from 'dfts-helper';
import {GetMyselfResponse} from '../../../waiterrobot-backend';

export class MyUserModel extends AEntityWithNumberIDAndName {
  public readonly emailAddress: string;
  public readonly firstname: string;
  public readonly surname: string;
  public readonly birthday: string;
  public isAdmin: boolean;

  constructor(data: GetMyselfResponse) {
    super(data.id, data.firstname + ' ' + data.surname, data);
    this.emailAddress = data.emailAddress;
    this.firstname = data.firstname;
    this.surname = data.surname;
    this.birthday = data.birthday;
    this.isAdmin = data.role === 'ADMIN';
  }
}
