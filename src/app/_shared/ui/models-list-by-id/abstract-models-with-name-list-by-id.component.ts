import {Component} from '@angular/core';
import {HasIDAndName, IHasID} from 'dfts-helper';
import {AbstractModelsListByIdComponentV2} from './abstract-models-list-by-id.component-v2';

@Component({
  template: '',
})
export abstract class AbstractModelsWithNameListByIdComponent<
  EntitiesTypes extends HasIDAndName<EntitiesTypes['id']>,
  EntityType extends IHasID<EntityType['id']>
> extends AbstractModelsListByIdComponentV2<EntitiesTypes, EntityType> {
  override nameMap = (it: EntitiesTypes) => it.name;
}
