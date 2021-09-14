import {Component, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';

import {AModel, AModelService, Converter, LoggerFactory, TypeHelper} from 'dfx-helper';

@Component({
  template: ''
})
export abstract class AModelEditComponent<Model extends AModel> implements OnDestroy {
  protected abstract redirectUrl: string;

  protected lumber = LoggerFactory.getLogger('AModelEditComponent');

  public isEditing = false;
  public activeTab = 1;
  protected onlyEditingTabs: number[] = [];

  public model: Model | undefined;
  private modelSubscription: Subscription | undefined;
  public modelLoaded = false;

  protected constructor(protected route: ActivatedRoute,
                        protected router: Router,
                        protected modelService: AModelService<Model>) {
    this.route.queryParams.subscribe((params => {
      if (params?.tab != null) {
        this.activeTab = Converter.stringToNumber(params?.tab);
        this.checkTab();
      }
    }));

    this.route.paramMap.subscribe((params) => {
      this.modelLoaded = false;
      const id = params.get('id');
      if (id != null) {
        if (TypeHelper.isNumeric(id)) {
          this.isEditing = true;
          const nId = Converter.stringToNumber(id);
          this.lumber.info('const', 'Model to open: ' + nId);
          this.model = this.modelService.getSingle(nId);
          if (this.model?.id == nId) {
            this.modelLoaded = true;
          }
          this.modelSubscription = this.modelService.singleChange.subscribe(value => {
            this.model = value;
            this.modelLoaded = true;
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
    this.modelSubscription?.unsubscribe();
  }

  public onTabChange($event: any): void {
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: {tab: $event.nextId},
        queryParamsHandling: 'merge'
      }).then();
  }

  public onSave(form: NgForm): void {
    const model = form.form.value;
    this.lumber.info('onSave', 'Model edit form value object', model);
    if (this.isEditing && this.model?.id != null) {
      model.id = this.model?.id;
      this.modelService.update(model);
    } else {
      this.modelService.create(model);
    }
    this.goToRedirectUrl();
  }

  public onDelete(modelId: number): void {
    this.modelService.delete(modelId);
    this.goToRedirectUrl();
  }

  private goToRedirectUrl(): void {
    this.router.navigateByUrl(this.redirectUrl).then();
  }
}
