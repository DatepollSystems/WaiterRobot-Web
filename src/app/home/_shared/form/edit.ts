import {Location} from '@angular/common';
import {inject, signal, Signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {derivedFrom} from 'ngxtension/derived-from';

import {map, startWith, tap} from 'rxjs';

import {injectConfirmDialog} from '../components/question-dialog.component';
import {AbstractModelEditFormComponent} from './abstract-model-edit-form.component';

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

export function injectContinuousCreation(options: {
  formComponent: Signal<AbstractModelEditFormComponent<unknown, unknown> | undefined>;
  continuousUsePropertyNames?: string[];
  enable?: boolean;
}): {
  set: (it: boolean) => void;
  enabled: Signal<boolean>;
  patch: (dto?: unknown) => void;
} {
  const {formComponent, continuousUsePropertyNames, enable} = options;

  const enabled = signal(enable ?? false);

  const patch = (dto?: unknown) => {
    console.info('checkContinuousCreation - continuous creation enabled, resetting form');
    formComponent()?.reset();

    if ((continuousUsePropertyNames?.length ?? 0) > 0) {
      console.info('checkContinuousCreation - continuous use properties found trying to reseed them');
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      for (const modelKeyValuePairs of Object.keys(dto as Record<string, never>).map((key) => [String(key), dto[key]])) {
        if (continuousUsePropertyNames?.includes(modelKeyValuePairs[0] as string)) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const control = modelKeyValuePairs[0];
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const value = modelKeyValuePairs[1];
          console.log(`checkContinuousCreation - patching control: "${control}" with value: "${value}"`);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
