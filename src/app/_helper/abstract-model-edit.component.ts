import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';

import {AComponent, Converter, IEntityWithNumberIDAndName, LoggerFactory, TypeHelper} from 'dfx-helper';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

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

  public entity: EntityType | undefined;
  public entityLoaded = false;

  protected constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected modal: NgbModal,
    protected modelService: AbstractModelService<EntityType>
  ) {
    super();

    this.route.paramMap.subscribe((params) => {
      this.entityLoaded = false;
      const id = params.get('id');
      if (id != null) {
        if (TypeHelper.isNumeric(id)) {
          this.isEditing = true;
          const nId = Converter.toNumber(id);
          this.lumber.info('const', 'Model to open: ' + nId);
          this.entity = this.modelService.getSingle(nId);
          if (this.entity?.id == nId) {
            this.entityLoaded = true;
            this.onEntityLoaded();
          }
          this.autoUnsubscribe(
            this.modelService.singleChange.subscribe((value) => {
              this.entity = value;
              this.entityLoaded = true;
              this.onEntityLoaded();
            })
          );
        } else {
          this.onEntityLoaded();
          this.isEditing = false;
          this.lumber.info('const', 'Create new model');
          this.checkTab();
        }
      } else {
        this.lumber.info('const', 'Nothing to open');
      }
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params?.tab != null) {
        this.activeTab = Converter.stringToNumber(params?.tab);
        this.checkTab();
      }
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

  private goToRedirectUrl(): void {
    void this.router.navigateByUrl(this.redirectUrl);
  }

  protected onEntityLoaded(): void {}

  protected addCustomAttributesBeforeCreateAndUpdate(model: any): any {
    return model;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected customCreateAndUpdateFilter(model: any): boolean {
    return true;
  }

  public setTabId(tabId: number): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {tab: tabId},
      queryParamsHandling: 'merge',
    });
  }

  public onSave(form: NgForm): void {
    let model = form.form.value;
    if (!this.customCreateAndUpdateFilter(model)) {
      return;
    }
    model = this.addCustomAttributesBeforeCreateAndUpdate(model);
    if (this.isEditing && this.entity?.id != null) {
      model.id = this.entity?.id;
      this.modelService.update(model);
    } else {
      this.modelService.create(model);
    }
    this.lumber.info('onSave', 'Model edit form value object', model);
    this.goToRedirectUrl();
  }

  public onDelete(modelId: number): void {
    const modalRef = this.modal.open(QuestionDialogComponent, {ariaLabelledBy: 'modal-question-title', size: 'lg'});
    modalRef.componentInstance.title = 'DELETE_CONFIRMATION';
    void modalRef.result.then((result) => {
      if (result?.toString().includes(QuestionDialogComponent.YES_VALUE)) {
        this.modelService.delete(modelId);
        this.goToRedirectUrl();
      }
    });
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
}
