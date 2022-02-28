import {AEntityWithNumberIDAndName} from 'dfx-helper';

export class SessionModel extends AEntityWithNumberIDAndName {
  public readonly registered_at: string;
  public readonly updated_at: string;

  constructor(data: any) {
    super(data.id, data.description, data);
    this.registered_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}