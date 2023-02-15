import {Component} from '@angular/core';
import {HasIDAndName} from 'dfts-helper';
import {AbstractModelsListWithDeleteComponent} from './abstract-models-list-with-delete.component';

@Component({
  template: '',
})
export abstract class AbstractModelsWithNameListWithDeleteComponent<
  EntityType extends HasIDAndName<EntityType['id']>
> extends AbstractModelsListWithDeleteComponent<EntityType> {
  override nameMap = (it: EntityType) => it.name;
}
