import {AEntityWithNumberIDAndName, EntityList, IEntityWithNumberIDAndName} from 'dfx-helper';
import {EntityWithNumberIDAndName} from '../a-entity.model';

export class DuplicateWaiterModel extends AEntityWithNumberIDAndName {
  public readonly waiters: EntityList<IEntityWithNumberIDAndName>;

  constructor(data: any) {
    super(0, data.name, data);
    this.waiters = data.waiters.map((duplicateWaiter: {id: number; name: string}) => {
      return new EntityWithNumberIDAndName(duplicateWaiter.id, duplicateWaiter.name, duplicateWaiter);
    });
  }
}
