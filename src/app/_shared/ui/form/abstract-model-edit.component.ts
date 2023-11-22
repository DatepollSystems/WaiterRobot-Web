import {Location} from '@angular/common';
import {ChangeDetectionStrategy, Component, Inject, inject, ViewChild} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {ActivatedRoute} from '@angular/router';

import {map, Observable, of, switchMap, tap} from 'rxjs';

import {IHasID, loggerOf, n_from, n_isNumeric, s_from} from 'dfts-helper';
import {HasGetSingle} from 'dfx-helper';

import {NotificationService} from '../../notifications/notification.service';
import {HasCreateWithIdResponse, HasUpdateWithIdResponse} from '../../services/services.interface';
import {AbstractModelEditFormComponent} from './abstract-model-edit-form.component';

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class AbstractModelEditComponent<
  CreateDTOType,
  UpdateDTOType extends IHasID<UpdateDTOType['id']>,
  EntityType extends IHasID<EntityType['id']>,
> {
  protected location = inject(Location);
  protected route = inject(ActivatedRoute);
  protected notificationService = inject(NotificationService);

  @ViewChild('form') form?: AbstractModelEditFormComponent<CreateDTOType, UpdateDTOType>;

  entity = toSignal(
    inject(ActivatedRoute).paramMap.pipe(
      map((params) => params.get('id')),
      map((id) => (n_isNumeric(id) ? n_from(id) : undefined)),
      switchMap((it) => (it ? this.entityService.getSingle$(it) : of('CREATE' as const))),
    ),
  );

  protected continuousUsePropertyNames: string[] = [];
  continuesCreation = false;

  protected lumber = loggerOf('AModelEditComponentV2');

  protected constructor(
    @Inject(null)
    protected entityService: HasGetSingle<EntityType> & HasCreateWithIdResponse<CreateDTOType> & HasUpdateWithIdResponse<UpdateDTOType>,
  ) {}

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
              // eslint-disable-next-line @typescript-eslint/no-unsafe-return
              for (const modelKeyValuePairs of Object.keys(dto as Record<string, never>).map((key) => [String(key), dto[key]])) {
                if (this.continuousUsePropertyNames.includes(modelKeyValuePairs[0] as string)) {
                  this.form?.patchValue({
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    [modelKeyValuePairs[0]]: modelKeyValuePairs[1],
                  });
                }
              }
            }
          }
        }),
      )
      .subscribe(() => {
        this.notificationService.tsuccess('SAVED');
      });
    if (!this.continuesCreation) {
      this.location.back();
    }
  }
}
