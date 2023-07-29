import {Component} from '@angular/core';
import {HasIDAndName, IHasID} from 'dfts-helper';
import {AbstractModelsListByIdComponent} from './abstract-models-list-by-id.component';

@Component({
  template: '',
})
export abstract class AbstractModelsWithNameListByIdComponent<
  EntitiesTypes extends HasIDAndName<EntitiesTypes['id']>,
  EntityType extends IHasID<EntityType['id']>,
> extends AbstractModelsListByIdComponent<EntitiesTypes, EntityType> {
  override nameMap = (it: EntitiesTypes): string => it.name;
}
