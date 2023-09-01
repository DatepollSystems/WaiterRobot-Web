import {Component} from '@angular/core';

import {IHasID, s_from} from 'dfts-helper';

import {HasIdAndNumber} from '../../services/services.interface';
import {AbstractModelsListByIdComponent} from './abstract-models-list-by-id.component';

@Component({
  template: '',
})
export abstract class AbstractModelsWithNumberListByIdComponent<
  EntitiesTypes extends HasIdAndNumber<EntitiesTypes['id']>,
  EntityType extends IHasID<EntityType['id']>,
> extends AbstractModelsListByIdComponent<EntitiesTypes, EntityType> {
  override nameMap = (it: EntitiesTypes): string => s_from(it.number);
}
