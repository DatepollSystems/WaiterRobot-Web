import {AbstractEntity, AbstractEntityService, AbstractSelectableEntityService} from 'dfx-helper';

export abstract class AbstractModelService<EntityType extends AbstractEntity<number>> extends AbstractEntityService<number, EntityType> {}

export abstract class AbstractSelectableModelService<EntityType extends AbstractEntity<number>> extends AbstractSelectableEntityService<
  number,
  EntityType
> {}
