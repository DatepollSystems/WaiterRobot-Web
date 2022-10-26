import {AEntityWithNumberIDAndName} from 'dfx-helper';
import {SessionResponse} from '../../../_shared/waiterrobot-backend';

export class SessionModel extends AEntityWithNumberIDAndName {
  public readonly registeredAt: string;
  public readonly updatedAt: string;

  constructor(data: SessionResponse) {
    super(data.id, data.description, data);
    this.registeredAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
