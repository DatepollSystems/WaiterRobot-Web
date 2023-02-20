import {AEntityWithNumberIDAndName} from 'dfts-helper';
import {SessionResponse} from '../waiterrobot-backend';

export class SessionModel extends AEntityWithNumberIDAndName {
  public readonly registeredAt: string;
  public readonly updatedAt: string;

  constructor(data: SessionResponse) {
    super(data.id, data.description, data);
    this.registeredAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
