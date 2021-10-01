import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';

import {AbstractEntityWithName, Converter, LoggerFactory, TypeHelper} from 'dfx-helper';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {AbstractComponent} from './abstract-component';
import {AbstractModelService} from '../_services/abstract-model.service';
import {QuestionDialogComponent} from './question-dialog/question-dialog.component';

@Component({
  template: '',
})
export abstract class AbstractModelEditComponent<EntityType extends AbstractEntityWithName<number>> extends AbstractComponent {
  protected abstract redirectUrl: string;

  protected lumber = LoggerFactory.getLogger('AModelEditComponent');

  public isEditing = false;
  public activeTab = 1;
  protected onlyEditingTabs: number[] = [];

  public entity: EntityType | undefined;
  public entityLoaded = false;

  protected constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected modelService: AbstractModelService<EntityType>,
    protected modal: NgbModal
  ) {
    super();

    this.route.queryParams.subscribe((params) => {
      if (params?.tab != null) {
        this.activeTab = Converter.stringToNumber(params?.tab);
        this.checkTab();
      }
    });

    this.route.paramMap.subscribe((params) => {
      this.entityLoaded = false;
      const id = params.get('id');
      if (id != null) {
        if (TypeHelper.isNumeric(id)) {
          this.isEditing = true;
          const nId = Converter.stringToNumber(id);
          this.lumber.info('const', 'Model to open: ' + nId);
          this.entity = this.modelService.getSingle(nId);
          if (this.entity?.id == nId) {
            this.entityLoaded = true;
            this.refreshValues();
          }
          this.autoUnsubscribe(
            this.modelService.singleChange.subscribe((value) => {
              this.entity = value;
              this.entityLoaded = true;
              this.refreshValues();
            })
          );
        } else {
          this.refreshValues();
          this.isEditing = false;
          this.lumber.info('const', 'Create new model');
          this.checkTab();
        }
      } else {
        this.lumber.info('const', 'Nothing to open');
      }
    });
  }

  public refreshValues(): void {}

  public onTabChange($event: any): void {
    this.router
      .navigate([], {
        relativeTo: this.route,
        queryParams: {tab: $event.nextId},
        queryParamsHandling: 'merge',
      })
      .then();
  }

  public onSave(form: NgForm): void {
    let model = form.form.value;
    model = this.addFieldsToHttpSaveModel(model);
    if (this.isEditing && this.entity?.id != null) {
      model.id = this.entity?.id;
      this.modelService.update(model);
    } else {
      this.modelService.create(model);
    }
    this.lumber.info('onSave', 'Model edit form value object', model);
    this.goToRedirectUrl();
  }

  protected addFieldsToHttpSaveModel(model: any): any {
    return model;
  }

  public onDelete(modelId: number): void {
    const modalRef = this.modal.open(QuestionDialogComponent, {ariaLabelledBy: 'modal-question-title', size: 'lg'});
    modalRef.componentInstance.title = 'DELETE_CONFIRMATION';
    modalRef.result.then(
      (result) => {
        if (result?.toString().includes(QuestionDialogComponent.YES_VALUE)) {
          this.modelService.delete(modelId);
          this.goToRedirectUrl();
        }
      },
      () => {}
    );
  }

  public onGoBack(): void {
    // We should probably use Angular's location.back();
    // but because this is a fully functional javascript feature we will use it till there is no tomorrow
    history.back();
  }

  private checkTab(): void {
    if (this.onlyEditingTabs.includes(this.activeTab)) {
      this.activeTab = 1;
    }
  }

  private goToRedirectUrl(): void {
    this.router.navigateByUrl(this.redirectUrl).then();
  }
}
