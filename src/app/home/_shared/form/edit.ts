import {Location} from '@angular/common';
import {Signal, inject, signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {ActivatedRoute, Router} from '@angular/router';

import {Observable, map, of, startWith, switchMap, tap} from 'rxjs';

import {n_from, n_isNumeric} from 'dfts-helper';
import {derivedFrom} from 'ngxtension/derived-from';
import {injectParams} from 'ngxtension/inject-params';

import {injectConfirmDialog} from '../components/question-dialog.component';
import {AbstractModelEditFormComponent} from './abstract-model-edit-form.component';

export function injectEditEntity<EntityType>({get$}: {get$: (id: number) => Observable<EntityType>}) {
  const idParam = injectParams('id');
  return toSignal(
    inject(ActivatedRoute).paramMap.pipe(
      map((params) => params.get('id')),
      map((id) => (n_isNumeric(id) ? n_from(id) : undefined)),
      switchMap((it) => (it ? get$(it) : of('CREATE' as const))),
    ),
  );
}

export function injectOnDelete<ID>(successFn: (it: ID) => void): (it: ID, event?: MouseEvent) => void {
  const confirmDialog = injectConfirmDialog();
  const location = inject(Location);

  return (it: ID, event?: MouseEvent): void => {
    event?.stopPropagation();

    void confirmDialog('DELETE_CONFIRMATION').then((result) => {
      if (result) {
        successFn(it);
        location.back();
      }
    });
  };
}

type ContinuousCreationDataTransformersMap = (it: unknown) => unknown;
type ContinuousCreationDataTransformers = Record<string, ContinuousCreationDataTransformersMap>;

export function injectContinuousCreation<CreateDTOType, UpdateDTOType>(options: {
  formComponent: Signal<AbstractModelEditFormComponent<CreateDTOType, UpdateDTOType> | undefined>;
  continuousUsePropertyNames?: (keyof CreateDTOType | keyof UpdateDTOType | string)[];
  enable?: boolean;
  dataTransformers?: ContinuousCreationDataTransformers;
}): {
  set: (it: boolean) => void;
  enabled: Signal<boolean>;
  patch: (dto?: unknown) => void;
} {
  const {formComponent, continuousUsePropertyNames, enable, dataTransformers} = options;

  const enabled = signal(enable ?? false);

  const patch = (dto?: unknown) => {
    console.info('checkContinuousCreation - continuous creation enabled, resetting form');
    formComponent()?.reset();

    if ((continuousUsePropertyNames?.length ?? 0) > 0) {
      console.info('checkContinuousCreation - continuous use properties found trying to reseed them');
      for (const modelKeyValuePairs of Object.keys(
        dto as Record<string, never>,
        // @ts-expect-error
      ).map((key) => [String(key), dto[key]])) {
        if (continuousUsePropertyNames?.includes(modelKeyValuePairs[0] as keyof CreateDTOType | keyof UpdateDTOType | string)) {
          const control = modelKeyValuePairs[0];
          const fun = dataTransformers ? (dataTransformers[control] as ContinuousCreationDataTransformersMap | undefined) : undefined;
          const value = fun ? fun(modelKeyValuePairs[1]) : modelKeyValuePairs[1];
          console.log(`checkContinuousCreation - patching control: "${control}" with value: "${value}"; transform fun: ${!!fun}`);
          formComponent()?.patchValue({[control]: value});
        }
      }
    }
  };

  const set = (it: boolean) => {
    enabled.set(it);
  };

  return {
    set,
    enabled,
    patch,
  };
}

export function injectTabControls<Tab>(options: {isCreating?: Signal<boolean>; defaultTab: Tab; onlyEditingTabs?: Tab[]}): {
  activeTab: Signal<Tab>;
  navigateToTab: (tab: Tab) => void;
} {
  const route = inject(ActivatedRoute);
  const router = inject(Router);

  const {isCreating, defaultTab, onlyEditingTabs} = options;

  const activeTab = derivedFrom(
    [
      isCreating ?? signal(false),
      route.queryParamMap.pipe(
        tap((it) => {
          console.log('activeTab - Params', it);
        }),
        map((params) => (params.get('tab') ?? undefined) as Tab | undefined),
        startWith(undefined),
      ),
    ],
    map(([_isCreating, tab]) => (tab === undefined || (_isCreating && onlyEditingTabs?.includes(tab)) ? defaultTab : tab)),
  );

  const navigateToTab = (tab: Tab): void => {
    void router.navigate([], {
      relativeTo: route,
      queryParams: {tab},
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  };

  return {
    activeTab,
    navigateToTab,
  };
}
