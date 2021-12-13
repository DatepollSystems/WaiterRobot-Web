import {AEntityWithNumberIDAndName} from 'dfx-helper';

export class UserModel extends AEntityWithNumberIDAndName {
  public readonly email_address: string;
  public readonly firstname: string;
  public readonly surname: string;
  public readonly birthday: string;
  public readonly activated: boolean;
  public readonly force_password_change: boolean;
  public is_admin: boolean;

  constructor(data: any) {
    super(data.id, data.firstname + ' ' + data.surname, data);
    this.email_address = data.email_address;
    this.firstname = data.firstname;
    this.surname = data.surname;
    this.birthday = data.birthday;
    this.activated = data.activated;
    this.force_password_change = data.force_password_change;
    this.is_admin = data.role === 'ADMIN';
  }
}
