import {AModel} from 'dfx-helper';

export class SessionsModel extends AModel {
  public readonly name: string;
  public readonly registered_at: string;

  constructor(data: any) {
    super(data.id);
    this.name = data.name;
    this.registered_at = data.registered_at;
  }
}
