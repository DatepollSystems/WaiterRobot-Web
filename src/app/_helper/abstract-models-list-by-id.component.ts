import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {IEntity, AEntityService, Converter, TypeHelper} from 'dfx-helper';

import {AbstractModelService} from '../_services/abstract-model.service';

import {AbstractModelsListComponent} from './abstract-models-list.component';

@Component({
  template: '',
})
export abstract class AbstractModelsListByIdComponent<
  EntitiesType extends IEntity<number>,
  EntityType extends IEntity<number>
> extends AbstractModelsListComponent<EntitiesType> {
  protected abstract getAllUrl: string;
  public entity: EntityType | undefined;

  protected constructor(
    modelService: AbstractModelService<EntitiesType>,
    modal: NgbModal,
    protected route: ActivatedRoute,
    protected router: Router,
    protected byIdEntityService: AEntityService<number, EntityType>
  ) {
    super(modelService, modal);

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
    this.entitiesService.setGetAllUrl(this.getAllUrl + this.entity.id);
    super.initializeEntities();
  }
}
