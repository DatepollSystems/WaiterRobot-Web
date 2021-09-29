import {Component, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';

import {Subscription} from 'rxjs';
import {Converter, LoggerFactory, StringHelper, TypeHelper} from 'dfx-helper';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {AbstractModelService} from '../_services/abstract-model.service';
import {QuestionDialogComponent} from './question-dialog/question-dialog.component';

import {AbstractEntityModel} from '../_models/abstract-entity.model';

@Component({
  template: '',
})
export abstract class AbstractModelEditComponent<EntityType extends AbstractEntityModel> implements OnDestroy {
  protected abstract redirectUrl: string;

  protected lumber = LoggerFactory.getLogger('AModelEditComponent');

  public isEditing = false;
  public activeTab = 1;
  protected onlyEditingTabs: number[] = [];

  public entity: EntityType | undefined;
  private entitySubscription: Subscription | undefined;
  public entityLoaded = false;

  protected constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected modelService: AbstractModelService<EntityType>,
    protected modal: NgbModal
  ) {
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
          }
          this.entitySubscription = this.modelService.singleChange.subscribe((value) => {
            this.entity = value;
            this.entityLoaded = true;
          });
        } else {
          this.isEditing = false;
          this.lumber.info('const', 'Create new model');
          this.checkTab();
        }
      } else {
        this.lumber.info('const', 'Nothing to open');
      }
    });
  }

  private checkTab(): void {
    if (this.onlyEditingTabs.includes(this.activeTab)) {
      this.activeTab = 1;
    }
  }

  public ngOnDestroy(): void {
    this.entitySubscription?.unsubscribe();
  }

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
    const model = form.form.value;
    this.lumber.info('onSave', 'Model edit form value object', model);
    if (this.isEditing && this.entity?.id != null) {
      model.id = this.entity?.id;
      this.modelService.update(model);
    } else {
      this.modelService.create(model);
    }
    this.goToRedirectUrl();
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

  private goToRedirectUrl(): void {
    this.router.navigateByUrl(this.redirectUrl).then();
  }
}
