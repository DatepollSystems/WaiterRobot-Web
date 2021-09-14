import {AModel} from 'dfx-helper';

export class WaiterModel extends AModel {
  public readonly name: string;
  public readonly token: string;
  public readonly organisation_id: number;
  public readonly event_ids: number[];

  constructor(data: any) {
    super(data.id);
    this.name = data.name;
    this.token = data.token;
    this.organisation_id = data.organisation_id;
    this.event_ids = data.event_ids;
  }
}
