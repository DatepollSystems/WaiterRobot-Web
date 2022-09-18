import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {AComponent, Converter, IEntityWithNumberIDAndName, LoggerFactory, TypeHelper} from 'dfx-helper';

import {AbstractModelService} from '../_services/models/abstract-model.service';
import {QuestionDialogComponent} from '../_shared/question-dialog/question-dialog.component';

@Component({
  template: '',
})
export abstract class AbstractModelEditComponent<EntityType extends IEntityWithNumberIDAndName> extends AComponent implements OnInit {
  protected abstract redirectUrl: string;
  protected onlyEditingTabs: number[] = [];

  protected lumber = LoggerFactory.getLogger('AModelEditComponent');

  public isEditing = false;
  public activeTab = 1;

  public continuousCreation = false;
  protected continuousUsePropertyNames: string[] = [];

  public entity: EntityType | undefined;
  public entityLoaded = false;

  protected constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected modal: NgbModal,
    protected modelService: AbstractModelService<EntityType>
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.entityLoaded = false;
      const id = params.get('id');
      if (id != null) {
        if (TypeHelper.isNumeric(id)) {
          this.isEditing = true;
          const nId = Converter.toNumber(id);
          this.lumber.info('const', 'Model to open: "' + nId + '"');
          this.entity = this.modelService.getSingle(nId);
          if (this.entity?.id == nId) {
            this.entityLoaded = true;
            this.onEntityEdit(this.entity);
          }
          this.autoUnsubscribe(
            this.modelService.singleChange.subscribe((value) => {
              this.entity = value;
              this.entityLoaded = true;
              this.onEntityEdit(this.entity!);
            })
          );
        } else {
          this.lumber.info('const', 'Create new model');
          this.onEntityCreate();
          this.isEditing = false;
          this.checkTab();
        }
      } else {
        this.lumber.info('const', 'Create new model');
        this.onEntityCreate();
        this.isEditing = false;
        this.checkTab();
      }
    });

    this.route.queryParams.subscribe((params) => {
      if (params?.tab != null && typeof params?.tab === 'string') {
        this.activeTab = Converter.toNumber(params?.tab);
        this.checkTab();
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected onEntityEdit(entity: EntityType): void {}

  protected onEntityCreate(): void {}

  /**
   * Adds custom attributes to the create and update model
   * @param model
   * @return any
   */
  protected addCustomAttributesBeforeCreateAndUpdate(model: any): any {
    return model;
  }

  /**
   * Returns true if everything passes, false if not.
   * If you return false, the model will not be created or updated
   * @param model
   * @return boolean
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected createAndUpdateFilter(model: any): boolean {
    return true;
  }

  public onGoBack(url?: string): void {
    if (url) {
      void this.router.navigateByUrl(url);
      return;
    }

    // We should probably use built-in location.back();
    // but because this is a fully functional javascript feature we will use it till there is no tomorrow
    history.back();
  }

  public setTabId(tabId: number): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {tab: tabId},
      queryParamsHandling: 'merge',
    });
  }

  private checkTab(): void {
    if (!this.isEditing) {
      if (this.onlyEditingTabs.includes(this.activeTab)) {
        this.lumber.info('checkTab', 'Tried to open editing only tab in create mode. Rerouting to tab 1');
        this.activeTab = 1;
        this.setTabId(1);
      }
    }
  }

  public onSave(form: NgForm): void {
    let model = form.form.value;
    this.lumber.info('onSave', 'Continuous creation: "' + this.continuousCreation + '"');
    if (!this.createAndUpdateFilter(model)) {
      this.lumber.info('onSave', 'Validation failed');
      return;
    }
    model = this.addCustomAttributesBeforeCreateAndUpdate(model);
    this.lumber.info('onSave', 'Model form value object', model);
    if (this.isEditing && this.entity?.id != null) {
      model.id = this.entity?.id;
      this.modelService.update(model).subscribe();
    } else {
      void this.modelService.create(model).subscribe();
      if (this.continuousCreation) {
        form.resetForm();

        if (this.continuousUsePropertyNames.length > 0) {
          for (const modelKeyValuePairs of Object.keys(model as Record<string, any>).map((key) => [String(key), model[key]])) {
            if (this.continuousUsePropertyNames.includes(modelKeyValuePairs[0] as string)) {
              form.form.patchValue({
                [modelKeyValuePairs[0]]: modelKeyValuePairs[1],
              });
            }
          }
        }
        return;
      }
    }
    this.goToRedirectUrl();
  }

  public onDelete(modelId: number): void {
    const modalRef = this.modal.open(QuestionDialogComponent, {ariaLabelledBy: 'modal-question-title', size: 'lg'});
    modalRef.componentInstance.title = 'DELETE_CONFIRMATION';
    void modalRef.result.then((result) => {
      this.lumber.info('onDelete', 'Confirm dialog result', result);
      if (result?.toString().includes(QuestionDialogComponent.YES_VALUE)) {
        this.modelService.delete(modelId).subscribe();
        this.goToRedirectUrl();
      }
    });
  }

  protected goToRedirectUrl(): void {
    void this.router.navigateByUrl(this.redirectUrl);
  }
}
