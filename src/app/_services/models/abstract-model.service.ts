import {AEntityService, ASelectableEntityService, IEntityWithNumberID} from 'dfx-helper';

export abstract class AbstractModelService<EntityType extends IEntityWithNumberID> extends AEntityService<number, EntityType> {}

export abstract class AbstractSelectableModelService<EntityType extends IEntityWithNumberID> extends ASelectableEntityService<
  number,
  EntityType
> {}
