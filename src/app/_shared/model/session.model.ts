import {HasIDAndName} from 'dfts-helper';

import {BackendType} from '@shared/api';

export class SessionModel implements HasIDAndName<number> {
  public readonly id: number;
  public readonly name: string;
  public readonly registeredAt: string;
  public readonly updatedAt: string;

  constructor(data: BackendType['SessionResponse']) {
    this.id = data.id;
    this.name = data.description;
    this.registeredAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
