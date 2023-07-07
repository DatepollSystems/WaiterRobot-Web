import {HasIDAndName} from 'dfts-helper';
import {GetMyselfResponse} from '../../../waiterrobot-backend';

export class MyUserModel implements HasIDAndName<number> {
  public readonly id: number;
  public readonly name: string;
  public readonly emailAddress: string;
  public readonly firstname: string;
  public readonly surname: string;
  public readonly birthday: string;
  public isAdmin: boolean;

  constructor(data: GetMyselfResponse) {
    this.id = data.id;
    this.name = `${data.firstname} ${data.surname}`;
    this.emailAddress = data.emailAddress;
    this.firstname = data.firstname;
    this.surname = data.surname;
    this.birthday = data.birthday;
    this.isAdmin = data.role === 'ADMIN';
  }
}
