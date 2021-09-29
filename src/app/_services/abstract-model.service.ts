import {AbstractEntityService, AbstractSelectableEntityService} from 'dfx-helper';
import {AbstractEntityModel} from '../_models/abstract-entity.model';

export abstract class AbstractModelService<EntityType extends AbstractEntityModel> extends AbstractEntityService<number, EntityType> {}

export abstract class AbstractSelectedModelService<EntityType extends AbstractEntityModel> extends AbstractSelectableEntityService<
  number,
  EntityType
> {}
