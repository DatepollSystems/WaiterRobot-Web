import {Component} from '@angular/core';
import {s_from} from 'dfts-helper';
import {HasIdAndNumber} from '../../services/abstract-entity.service';
import {AbstractModelsListWithDeleteComponent} from './abstract-models-list-with-delete.component';

@Component({
  template: '',
})
export abstract class AbstractModelsWithNumberListWithDeleteComponent<
  EntityType extends HasIdAndNumber<EntityType['id']>
> extends AbstractModelsListWithDeleteComponent<EntityType> {
  override nameMap = (it: EntityType) => s_from(it.number);
}
