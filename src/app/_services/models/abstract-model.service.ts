import {AEntityService, ASelectableEntityService, IEntity} from 'dfx-helper';

export abstract class AbstractModelService<EntityType extends IEntity<number>> extends AEntityService<number, EntityType> {}

export abstract class AbstractSelectableModelService<EntityType extends IEntity<number>> extends ASelectableEntityService<
  number,
  EntityType
> {}
