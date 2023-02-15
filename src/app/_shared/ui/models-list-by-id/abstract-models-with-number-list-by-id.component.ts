import {Component} from '@angular/core';
import {IHasID, s_from} from 'dfts-helper';
import {HasIdAndNumber} from '../../services/abstract-entity.service';
import {AbstractModelsListByIdComponentV2} from './abstract-models-list-by-id.component-v2';

@Component({
  template: '',
})
export abstract class AbstractModelsWithNumberListByIdComponent<
  EntitiesTypes extends HasIdAndNumber<EntitiesTypes['id']>,
  EntityType extends IHasID<EntityType['id']>
> extends AbstractModelsListByIdComponentV2<EntitiesTypes, EntityType> {
  override nameMap = (it: EntitiesTypes) => s_from(it.number);
}
