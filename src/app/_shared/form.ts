import {Location} from '@angular/common';
import {inject, Signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {FormBuilder, FormGroup, NonNullableFormBuilder} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AlphabeticIdResponse, IdResponse} from '@shared/waiterrobot-backend';

import {IHasID, s_from} from 'dfts-helper';

import {distinctUntilChanged, map, Observable} from 'rxjs';

import {NotificationService} from './notifications/notification.service';
import {HasCreateWithIdResponse, HasUpdateWithIdResponse} from './services/services.interface';

export function injectIsValid(form: FormGroup): Signal<boolean> {
  return toSignal(
    form.statusChanges.pipe(
      distinctUntilChanged(),
      map(() => {
        const valid = form.valid;
        console.log(`formValidChange is valid = ${valid}`, form.value);
        return valid;
      }),
    ),
    {initialValue: form.valid},
  );
}

export function injectCustomFormBuilder(): NonNullableFormBuilder {
  return inject(FormBuilder).nonNullable;
}

export function injectOnSubmit<CreateDTOType, UpdateDTOType extends IHasID<UpdateDTOType['id']>>(options: {
  entityService: HasCreateWithIdResponse<CreateDTOType> & HasUpdateWithIdResponse<UpdateDTOType>;
  continuousCreation?: {
    enabled: Signal<boolean>;
    patch: (dto: unknown) => void;
  };
  openOnCreate?: boolean;
}): (method: 'CREATE' | 'UPDATE', dto: CreateDTOType | UpdateDTOType) => void {
  const {entityService, continuousCreation, openOnCreate} = options;

  const notificationService = inject(NotificationService);
  const location = inject(Location);
  const router = inject(Router);
  const relativeTo = inject(ActivatedRoute);

  return (method: 'CREATE' | 'UPDATE', dto: CreateDTOType | UpdateDTOType) => {
    console.info(`submit - method: "${method}"; Continuous creation check enabled: "${s_from(!!continuousCreation)}"`, dto);

    let obs$: Observable<IdResponse | AlphabeticIdResponse>;

    switch (method) {
      case 'CREATE':
        obs$ = entityService.create$(dto as CreateDTOType);
        break;
      case 'UPDATE':
        obs$ = entityService.update$(dto as UpdateDTOType);
        break;
      default:
        throw Error('Not implemented');
    }

    obs$.subscribe((response) => {
      if (continuousCreation?.enabled()) {
        continuousCreation.patch(dto);
      } else {
        console.log('injectOnSubmit - continuesCreation disabled');
        if (method === 'CREATE' && openOnCreate) {
          console.log('injectOnSubmit - continuesCreation disabled, method is create and openOnCreate true, redirecting to entity page');
          void router.navigate(['../', response.id], {relativeTo});
        }
      }
      notificationService.tsuccess('SAVED');
    });

    // If checkContinuousCreation is provided let it handle the redirect
    if (!openOnCreate) {
      if (!continuousCreation || !continuousCreation.enabled() || method === 'UPDATE') {
        console.log('injectOnSubmit - going back', continuousCreation?.enabled(), method, openOnCreate);
        location.back();
      }
    }
  };
}
