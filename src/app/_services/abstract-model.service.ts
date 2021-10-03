import {AbstractEntity, AbstractEntityService, AbstractSelectableEntityService, StorageHelper} from 'dfx-helper';

export abstract class AbstractModelService<EntityType extends AbstractEntity<number>> extends AbstractEntityService<number, EntityType> {}

export abstract class AbstractSelectedModelService<EntityType extends AbstractEntity<number>> extends AbstractSelectableEntityService<
  number,
  EntityType
> {}
