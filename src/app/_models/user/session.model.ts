import {AEntityWithNumberIDAndName} from 'dfx-helper';

export class SessionModel extends AEntityWithNumberIDAndName {
  public readonly registeredAt: string;
  public readonly updatedAt: string;

  constructor(data: any) {
    super(data.id, data.description, data);
    this.registeredAt = data.created_at;
    this.updatedAt = data.updated_at;
  }
}
