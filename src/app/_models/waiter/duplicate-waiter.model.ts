import {AEntityWithNumberIDAndName, EntityList, IEntityList, IEntityWithNumberIDAndName} from 'dfx-helper';
import {EntityWithNumberIDAndName} from '../a-entity.model';
import {DuplicateWaiterResponse} from '../waiterrobot-backend';

export class DuplicateWaiterModel extends AEntityWithNumberIDAndName {
  public readonly waiters: IEntityList<IEntityWithNumberIDAndName>;

  constructor(data: DuplicateWaiterResponse) {
    super(0, data.name, data);
    this.waiters = new EntityList(
      data.waiters.map((duplicateWaiter: {id: number; name: string}) => {
        return new EntityWithNumberIDAndName(duplicateWaiter.id, duplicateWaiter.name, duplicateWaiter);
      })
    );
  }
}
