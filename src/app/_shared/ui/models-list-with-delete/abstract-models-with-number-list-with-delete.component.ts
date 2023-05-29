import {Component} from '@angular/core';
import {s_from} from 'dfts-helper';
import {HasIdAndNumber} from '../../services/services.interface';
import {AbstractModelsListWithDeleteComponent} from './abstract-models-list-with-delete.component';

@Component({
  template: '',
  selector: 'abstract-models-with-number-list-with-delete',
})
export abstract class AbstractModelsWithNumberListWithDeleteComponent<
  EntityType extends HasIdAndNumber<EntityType['id']>
> extends AbstractModelsListWithDeleteComponent<EntityType> {
  override nameMap = (it: EntityType): string => s_from(it.number);
}
