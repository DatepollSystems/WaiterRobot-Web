import {AEntityWithNumberIDAndName} from 'dfx-helper';

export class WaiterModel extends AEntityWithNumberIDAndName {
  public readonly signInToken: string;
  public readonly organisation_id: number;
  public readonly events: number[];

  constructor(data: any) {
    super(data.id, data.name, data);
    this.signInToken = data.sign_in_token;
    this.organisation_id = data.organisation_id;
    this.events = data.events;
  }
}
