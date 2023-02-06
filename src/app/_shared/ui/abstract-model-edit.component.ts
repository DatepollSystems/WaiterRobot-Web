import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {IEntityWithNumberIDAndName, loggerOf, n_from, n_is} from 'dfts-helper';

import {AComponent} from 'dfx-helper';
import {tap} from 'rxjs';

import {AbstractModelService} from '../services/abstract-model.service';
import {QuestionDialogComponent} from './question-dialog/question-dialog.component';

@Component({
  template: '',
})
export abstract class AbstractModelEditComponent<EntityType extends IEntityWithNumberIDAndName> extends AComponent implements OnInit {
  protected abstract redirectUrl: string;
  protected onlyEditingTabs: number[] = [];

  protected lumber = loggerOf('AModelEditComponent');

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
    this.unsubscribe(
      this.route.paramMap.subscribe((params) => {
        this.entityLoaded = false;
        const id = params.get('id');
        if (id != null) {
          if (n_is(id)) {
            this.isEditing = true;
            const nId = n_from(id);
            this.lumber.info('const', 'Model to open: "' + nId + '"');
            this.entity = this.modelService.getSingle(nId);
            if (this.entity && this.entity?.id == nId) {
              this.entityLoaded = true;
              this.onEntityEdit(this.entity);
            }
            this.unsubscribe(
              this.modelService.singleChange.subscribe((value) => {
                this.entity = value;
                this.entityLoaded = true;
                this.onEntityEdit(value);
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
      })
    );

    this.unsubscribe(
      this.route.queryParams.subscribe((params) => {
        if (params?.tab != null && typeof params?.tab === 'string') {
          this.activeTab = n_from(params?.tab);
          this.checkTab();
        }
      })
    );
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
    if (!this.isEditing && this.onlyEditingTabs.includes(this.activeTab)) {
      this.lumber.info('checkTab', 'Tried to open editing only tab in create mode. Rerouting to tab 1');
      this.activeTab = 1;
      this.setTabId(1);
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

    const methode = this.isEditing && this.entity?.id != null ? this.modelService.update(model) : this.modelService.create(model);

    methode
      .pipe(
        tap(() => {
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
          }
        })
      )
      .subscribe();
    if (!this.continuousCreation) {
      this.goToRedirectUrl();
    }
  }

  public async onDelete(modelId: number): Promise<void> {
    const modalRef = this.modal.open(QuestionDialogComponent, {ariaLabelledBy: 'modal-question-title', size: 'lg'});
    modalRef.componentInstance.title = 'DELETE_CONFIRMATION';
    const result = await modalRef.result;
    this.lumber.info('onDelete', 'Confirm dialog result', result);
    if (result?.toString().includes(QuestionDialogComponent.YES_VALUE)) {
      this.modelService.delete(modelId).subscribe();
      this.goToRedirectUrl();
    }
  }

  protected goToRedirectUrl(): void {
    void this.router.navigateByUrl(this.redirectUrl);
  }
}
