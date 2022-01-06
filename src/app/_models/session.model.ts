import {AEntityWithNumberIDAndName} from 'dfx-helper';

export class SessionsModel extends AEntityWithNumberIDAndName {
  public readonly registered_at: string;

  constructor(data: any) {
    super(data.id, data.description, data);
    this.registered_at = data.created_at;
  }
}
