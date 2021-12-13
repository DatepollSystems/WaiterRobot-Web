import {Component} from '@angular/core';
import {Router} from '@angular/router';

import {AComponent, IEntityWithNumberIDAndName, LoggerFactory} from 'dfx-helper';

import {AbstractModelService} from '../_services/models/abstract-model.service';

@Component({
  template: '',
})
export abstract class AbstractModelsComponent<EntityType extends IEntityWithNumberIDAndName> extends AComponent {
  private lumber = LoggerFactory.getLogger('AbstractModelsListComponentById');

  public selectedModelToShow = 'default';
  public allModels: EntityType[] = [];

  protected constructor(protected router: Router, protected modelsService: AbstractModelService<EntityType>) {
    super();

    this.allModels = this.modelsService.getAll();
    this.autoUnsubscribe(
      modelsService.allChange.subscribe((models) => {
        this.allModels = models;
      })
    );
  }

  public linkClick(): void {
    this.selectedModelToShow = 'default';
  }

  public showModel(value: string): void {
    if (value.includes('default')) {
      return;
    }
    this.lumber.info('showModel', 'Showing model "' + value + '"');
    void this.router.navigateByUrl(value).then();
  }
}
