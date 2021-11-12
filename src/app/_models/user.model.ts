import {AEntityWithNumberIDAndName} from 'dfx-helper';

export class UserModel extends AEntityWithNumberIDAndName {
  public readonly email_address: string;
  public readonly firstname: string;
  public readonly surname: string;
  public readonly birthday: Date;
  public is_admin: boolean;

  constructor(data: any) {
    super(data.id, data.firstname + ' ' + data.surname, data);
    this.email_address = data.email_address;
    this.firstname = data.firstname;
    this.surname = data.surname;
    this.birthday = new Date(data.birthday);
    this.is_admin = data.role === 'ADMIN';
  }
}
