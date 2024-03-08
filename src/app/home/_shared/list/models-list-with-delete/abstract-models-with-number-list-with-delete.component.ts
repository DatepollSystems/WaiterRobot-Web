import {Component} from '@angular/core';

import {HasIdAndNumber} from '@shared/services/services.interface';

import {s_from} from 'dfts-helper';
import {AbstractModelsListWithDeleteComponent} from './abstract-models-list-with-delete.component';

@Component({
  standalone: true,
  template: '',
  selector: 'abstract-models-with-number-list-with-delete',
})
export abstract class AbstractModelsWithNumberListWithDeleteComponent<
  EntityType extends HasIdAndNumber<EntityType['id']>,
> extends AbstractModelsListWithDeleteComponent<EntityType> {
  override nameMap = (it: EntityType): string => s_from(it.number);
}
