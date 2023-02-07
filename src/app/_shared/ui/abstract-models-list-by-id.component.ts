import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {IEntityWithNumberID, IEntityWithNumberIDAndName, n_from, n_isNumeric} from 'dfts-helper';
import {AEntityService} from 'dfx-helper';

import {AbstractModelService} from '../services/abstract-model.service';

import {AbstractModelsListComponent} from './abstract-models-list.component';

@Component({
  template: '',
})
export abstract class AbstractModelsListByIdComponent<
  EntitiesType extends IEntityWithNumberIDAndName,
  EntityType extends IEntityWithNumberID
> extends AbstractModelsListComponent<EntitiesType> {
  protected abstract getAllParam: string;
  public entity: EntityType | undefined;

  protected constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    modal: NgbModal,
    modelService: AbstractModelService<EntitiesType>,
    protected byIdEntityService: AEntityService<number, EntityType>
  ) {
    super(modal, modelService);

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id != null && n_isNumeric(id)) {
        this.unsubscribeAll();
        const nId = n_from(id);
        this.lumber.info('const', 'Entity to open: ' + nId);
        this.entity = this.byIdEntityService.getSingle(nId);
        this.unsubscribe(
          this.byIdEntityService.singleChange.subscribe((entity) => {
            this.entity = entity;
            this.initializeEntities();
          })
        );
      } else {
        this.lumber.error('const', 'Entity not abel to open', id);
        void this.router.navigateByUrl('/home');
      }
    });
  }

  protected override initializeEntities(): void {
    if (!this.entity) {
      return;
    }
    this.entitiesService.setGetAllParams([{key: this.getAllParam, value: this.entity.id}]);
    super.initializeEntities();
  }
}
