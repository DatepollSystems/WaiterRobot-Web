import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {IEntityWithNumberIDAndName, loggerOf} from 'dfts-helper';

import {AComponent} from 'dfx-helper';

import {AbstractModelService} from '../services/abstract-model.service';

@Component({
  template: '',
})
export abstract class AbstractModelsComponent<EntityType extends IEntityWithNumberIDAndName> extends AComponent {
  private lumber = loggerOf('AbstractModelsListComponentById');

  public selectedModelToShow = 'default';
  public allModels: EntityType[] = [];

  protected constructor(protected router: Router, protected modelsService: AbstractModelService<EntityType>) {
    super();

    this.allModels = this.modelsService.getAll();
    this.unsubscribe(modelsService.allChange.subscribe((it) => (this.allModels = it)));
  }

  public linkClick(): void {
    this.selectedModelToShow = 'default';
  }

  public showModel(value: string): void {
    if (value.includes('default')) {
      return;
    }
    this.lumber.info('showModel', 'Showing model "' + value + '"');
    void this.router.navigateByUrl(value);
  }
}
