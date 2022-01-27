import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AEntityService, Converter, IEntityWithNumberID, TypeHelper} from 'dfx-helper';

import {AbstractModelService} from '../_services/models/abstract-model.service';

import {AbstractModelsListComponent} from './abstract-models-list.component';

@Component({
  template: '',
})
export abstract class AbstractModelsListByIdComponent<
  EntitiesType extends IEntityWithNumberID,
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
      if (id != null) {
        if (TypeHelper.isNumeric(id)) {
          const nId = Converter.toNumber(id);
          this.lumber.info('const', 'Model to open: ' + nId);
          this.entity = this.byIdEntityService.getSingle(nId);
          this.autoUnsubscribe(
            this.byIdEntityService.singleChange.subscribe((entity) => {
              this.entity = entity;
              this.initializeEntities();
            })
          );
        } else {
          // ERROR
          void this.router.navigateByUrl('/home');
        }
      } else {
        // ERROR
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
