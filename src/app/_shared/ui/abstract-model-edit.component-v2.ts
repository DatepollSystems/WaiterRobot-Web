import {Location} from '@angular/common';
import {ChangeDetectionStrategy, Component, Inject, inject, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {HasIDAndName, IHasID, loggerOf, n_from, n_isNumeric, s_is} from 'dfts-helper';
import {combineLatest, map, Observable, of, switchMap, tap} from 'rxjs';
import {HasCreateWithIdResponse, HasDelete, HasGetSingle, HasUpdateWithIdResponse} from '../services/abstract-entity.service';
import {AbstractModelEditFormComponent} from './abstract-model-edit-form.component';
import {AppModelEditSaveBtn} from './app-model-edit-save-btn.component';
import {QuestionDialogComponent} from './question-dialog/question-dialog.component';

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class AbstractModelEditComponentV2<
  CreateDTOType,
  UpdateDTOType extends IHasID<UpdateDTOType['id']>,
  EntityType extends HasIDAndName<EntityType['id']>,
  Tab
> {
  protected location = inject(Location);
  protected router = inject(Router);
  protected route = inject(ActivatedRoute);
  protected modal = inject(NgbModal);

  @ViewChild('form') form?: AbstractModelEditFormComponent<CreateDTOType, UpdateDTOType>;

  @ViewChild(AppModelEditSaveBtn) submitBtn?: AppModelEditSaveBtn;

  entity$: Observable<EntityType | 'CREATE'> = this.route.paramMap.pipe(
    map((params) => params.get('id')),
    switchMap((id) => (n_isNumeric(id) ? this.entityService.getSingle$(n_from(id)) : of('CREATE' as const)))
  );

  protected redirectUrl!: string;

  protected defaultTab!: Tab;
  protected onlyEditingTabs: Tab[] = [];
  public activeTab$ = combineLatest([
    this.route.queryParams.pipe(map((params) => (s_is(params.tab) ? (params.tab as Tab) : undefined))),
    this.entity$,
  ]).pipe(
    map(([tab, entity]) => (tab === undefined || (entity === 'CREATE' && this.onlyEditingTabs.includes(tab)) ? this.defaultTab : tab))
  );

  protected continuousUsePropertyNames: string[] = [];
  public continuousCreation = false;

  protected lumber = loggerOf('AModelEditComponentV2');

  protected constructor(
    @Inject(null)
    protected entityService: HasGetSingle<EntityType> &
      HasCreateWithIdResponse<CreateDTOType> &
      HasUpdateWithIdResponse<UpdateDTOType> &
      HasDelete<EntityType>
  ) {}

  setValid(valid: 'VALID' | 'INVALID') {
    if (!this.submitBtn) {
      return;
    }
    this.submitBtn.formValid = valid;
  }

  submitCreate(dto: CreateDTOType): void {
    this.submit('CREATE', dto);
  }

  submitUpdate(dto: UpdateDTOType): void {
    this.submit('UPDATE', dto);
  }

  /**
   * Adds custom attributes to create dto
   */
  protected overrideCreateDto(dto: CreateDTOType): CreateDTOType {
    return dto;
  }

  /**
   * Adds custom attributes to update dto
   */
  protected overrideUpdateDto(dto: UpdateDTOType): UpdateDTOType {
    return dto;
  }

  private submit<T>(method: 'CREATE' | 'UPDATE', dto: CreateDTOType | UpdateDTOType): void {
    this.lumber.info('submit', `method: "${method}"; Continuous creation: "${this.continuousCreation}"`, dto);

    let obs$: Observable<unknown>;

    switch (method) {
      case 'CREATE':
        obs$ = this.entityService.create$(this.overrideCreateDto(dto as CreateDTOType));
        break;
      case 'UPDATE':
        obs$ = this.entityService.update$(this.overrideUpdateDto(dto as UpdateDTOType));
        break;
      default:
        throw Error('Not implemented');
    }

    obs$
      .pipe(
        tap(() => {
          if (this.continuousCreation) {
            this.form?.reset();

            if (this.continuousUsePropertyNames.length > 0) {
              // @ts-ignore
              for (const modelKeyValuePairs of Object.keys(dto as Record<string, any>).map((key) => [String(key), dto[key]])) {
                if (this.continuousUsePropertyNames.includes(modelKeyValuePairs[0] as string)) {
                  this.form?.patchValue({
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

  public isEditing(entity: EntityType | 'CREATE'): entity is EntityType {
    return entity !== 'CREATE';
  }

  public onGoBack(url?: string): void {
    if (url) {
      void this.router.navigateByUrl(url);
      return;
    }

    this.location.back();
  }

  public navigateToTab(tab: Tab): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {tab: tab},
      queryParamsHandling: 'merge',
    });
  }

  public async onDelete(modelId: EntityType['id']): Promise<void> {
    const modalRef = this.modal.open(QuestionDialogComponent, {ariaLabelledBy: 'modal-question-title', size: 'lg'});
    modalRef.componentInstance.title = 'DELETE_CONFIRMATION';
    const result = await modalRef.result;
    this.lumber.info('onDelete', 'Confirm dialog result', result);
    if (result?.toString().includes(QuestionDialogComponent.YES_VALUE)) {
      this.entityService.delete$(modelId).subscribe();
      this.goToRedirectUrl();
    }
  }

  protected goToRedirectUrl(): void {
    void this.router.navigateByUrl(this.redirectUrl);
  }
}
