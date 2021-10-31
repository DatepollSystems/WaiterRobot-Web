import {AEntityWithNumberIDAndName} from 'dfx-helper';

export class SessionsModel extends AEntityWithNumberIDAndName {
  public readonly registered_at: string;

  constructor(data: any) {
    super(data.id, data.name, data);
    this.registered_at = data.registered_at;
  }
}
