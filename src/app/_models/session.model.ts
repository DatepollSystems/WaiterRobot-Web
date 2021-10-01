import {AbstractEntityWithName} from 'dfx-helper';

export class SessionsModel extends AbstractEntityWithName<number> {
  public readonly registered_at: string;

  constructor(data: any) {
    super(data.id, data.name);
    this.registered_at = data.registered_at;
  }
}
