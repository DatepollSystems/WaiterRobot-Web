import {Component} from '@angular/core';
import {Router} from '@angular/router';

import {AbstractComponent, AbstractEntityWithName, LoggerFactory} from 'dfx-helper';

import {AbstractModelService} from '../_services/abstract-model.service';

@Component({
  template: '',
})
export abstract class AbstractModelsComponent<EntityType extends AbstractEntityWithName<number>> extends AbstractComponent {
  selectedModelToShow = 'default';
  allModels: EntityType[] = [];
  private lumber = LoggerFactory.getLogger('AbstractModelsListComponentById');

  protected constructor(protected router: Router, protected modelsService: AbstractModelService<EntityType>) {
    super();

    this.allModels = this.modelsService.getAll();
    this.autoUnsubscribe(
      modelsService.allChange.subscribe((models) => {
        this.allModels = models;
      })
    );
  }

  linkClick() {
    this.selectedModelToShow = 'default';
  }

  showModel(value: any) {
    if (value.includes('default')) {
      return;
    }
    this.lumber.info('showModel', 'Showing model "' + value + '"');
    this.router.navigateByUrl(value).then();
  }
}
