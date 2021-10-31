import {AEntityWithNumberIDAndName} from 'dfx-helper';

export class WaiterModel extends AEntityWithNumberIDAndName {
  public readonly token: string;
  public readonly organisation_id: number;
  public readonly event_ids: number[];

  constructor(data: any) {
    super(data.id, data.name, data);
    this.token = data.token;
    this.organisation_id = data.organisation_id;
    this.event_ids = data.event_ids;
  }
}
