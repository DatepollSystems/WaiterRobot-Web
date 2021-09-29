import {AbstractEntityModelWithName} from './abstract-entity.model';

export class SessionsModel extends AbstractEntityModelWithName {
  public readonly registered_at: string;

  constructor(data: any) {
    super(data.id, data.name);
    this.registered_at = data.registered_at;
  }
}
