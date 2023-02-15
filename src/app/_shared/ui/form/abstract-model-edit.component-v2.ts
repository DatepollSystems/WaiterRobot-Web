import {Location} from '@angular/common';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, inject, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {IHasID, loggerOf, n_from, n_isNumeric, s_from, s_is} from 'dfts-helper';
import {BehaviorSubject, combineLatest, map, Observable, of, switchMap, tap} from 'rxjs';
import {HasCreateWithIdResponse, HasDelete, HasGetSingle, HasUpdateWithIdResponse} from '../../services/abstract-entity.service';
import {QuestionDialogComponent} from '../question-dialog/question-dialog.component';
import {AbstractModelEditFormComponent} from './abstract-model-edit-form.component';

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class AbstractModelEditComponentV2<
  CreateDTOType,
  UpdateDTOType extends IHasID<UpdateDTOType['id']>,
  EntityType extends IHasID<EntityType['id']>,
  Tab
> {
  protected location = inject(Location);
  protected router = inject(Router);
  protected route = inject(ActivatedRoute);
  protected modal = inject(NgbModal);
  protected cdr = inject(ChangeDetectorRef);

  @ViewChild('form') form?: AbstractModelEditFormComponent<CreateDTOType, UpdateDTOType>;

  valid$ = new BehaviorSubject<'VALID' | 'INVALID'>('INVALID');

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
  continuesCreation = false;

  protected lumber = loggerOf('AModelEditComponentV2');

  protected constructor(
    @Inject(null)
    protected entityService: HasGetSingle<EntityType> &
      HasCreateWithIdResponse<CreateDTOType> &
      HasUpdateWithIdResponse<UpdateDTOType> &
      HasDelete<EntityType>
  ) {}

  setValid(valid: 'VALID' | 'INVALID'): void {
    this.valid$.next(valid);
    this.cdr.detectChanges();
  }

  submit(method: 'CREATE' | 'UPDATE', dto: CreateDTOType | UpdateDTOType): void {
    this.lumber.info('submit', `method: "${method}"; Continuous creation: "${s_from(this.continuesCreation)}"`, dto);

    let obs$: Observable<unknown>;

    switch (method) {
      case 'CREATE':
        obs$ = this.entityService.create$(dto as CreateDTOType);
        break;
      case 'UPDATE':
        obs$ = this.entityService.update$(dto as UpdateDTOType);
        break;
      default:
        throw Error('Not implemented');
    }

    obs$
      .pipe(
        tap(() => {
          if (this.continuesCreation) {
            this.form?.reset();

            if (this.continuousUsePropertyNames.length > 0) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
    if (!this.continuesCreation) {
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
