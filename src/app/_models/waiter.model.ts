import {AbstractEntityWithName} from 'dfx-helper';

export class WaiterModel extends AbstractEntityWithName<number> {
  public readonly token: string;
  public readonly organisation_id: number;
  public readonly event_ids: number[];

  constructor(data: any) {
    super(data.id, data.name);
    this.token = data.token;
    this.organisation_id = data.organisation_id;
    this.event_ids = data.event_ids;
  }
}
