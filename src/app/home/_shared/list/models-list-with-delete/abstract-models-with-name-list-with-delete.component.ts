import {Component} from '@angular/core';

import {HasIDAndName} from 'dfts-helper';

import {AbstractModelsListWithDeleteComponent} from './abstract-models-list-with-delete.component';

@Component({
  standalone: true,
  template: '',
  selector: 'abstract-models-with-name-list-with-delete',
})
export abstract class AbstractModelsWithNameListWithDeleteComponent<
  EntityType extends HasIDAndName<EntityType['id']>,
> extends AbstractModelsListWithDeleteComponent<EntityType> {
  override nameMap = (it: EntityType): string => it.name;
}
