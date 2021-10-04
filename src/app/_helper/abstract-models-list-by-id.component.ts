import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AbstractEntity, AbstractEntityService, Converter, TypeHelper} from 'dfx-helper';

import {AbstractModelService} from '../_services/abstract-model.service';

import {AbstractModelsListComponent} from './abstract-models-list.component';

@Component({
  template: '',
})
export abstract class AbstractModelsListComponentById<
  EntitiesType extends AbstractEntity<number>,
  EntityType extends AbstractEntity<number>
> extends AbstractModelsListComponent<EntitiesType> {
  protected abstract getAllUrl: string;
  entity: EntityType | undefined;

  protected constructor(
    modelService: AbstractModelService<EntitiesType>,
    modal: NgbModal,
    protected route: ActivatedRoute,
    protected router: Router,
    protected entityService: AbstractEntityService<number, EntityType>
  ) {
    super(modelService, modal);

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id != null) {
        this.entitiesLoaded = false;
        if (TypeHelper.isNumeric(id)) {
          const nId = Converter.stringToNumber(id);
          this.lumber.info('const', 'Model to open: ' + nId);
          this.entity = this.entityService.getSingle(nId);
          if (this.entity?.id == nId) {
            this.initializeVariables();
          }
          this.autoUnsubscribe(
            this.entityService.singleChange.subscribe((entity) => {
              this.entity = entity;
              this.initializeVariables();
            })
          );
        } else {
          // ERROR
          this.router.navigateByUrl('/home').then();
        }
      } else {
        // ERROR
        this.router.navigateByUrl('/home').then();
      }
    });
  }

  protected override initializeVariables() {
    if (!this.entity) {
      return;
    }
    this.modelService.setGetAllUrl(this.getAllUrl + this.entity.id);
    super.initializeVariables();
  }
}
