import {AEntityWithNumberIDAndName} from 'dfx-helper';

export class WaiterModel extends AEntityWithNumberIDAndName {
  public readonly signInToken: string;
  public readonly activated: boolean;
  public readonly organisationId: number;
  public readonly events: number[];

  constructor(data: any) {
    super(data.id, data.name, data);
    this.signInToken = data.signInToken;
    this.activated = data.activated;
    this.organisationId = data.organisationId;
    this.events = data.events;
  }
}
