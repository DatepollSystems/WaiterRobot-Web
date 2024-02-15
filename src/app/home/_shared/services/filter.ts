/* eslint-disable */
// noinspection NonAsciiCharacters,JSNonASCIINames

import {inject, Signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {AbstractControl, FormGroup, ɵValue} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {injectIsValid} from '@shared/form';

import {loggerOf, n_from} from 'dfts-helper';
import {computedFrom} from 'ngxtension/computed-from';

import {distinctUntilChanged, map, merge, Observable, shareReplay} from 'rxjs';

export function injectFilter<
  TControl extends {
    [K in keyof TControl]: AbstractControl<any>;
  } = any,
>(
  form: FormGroup<TControl>,
): {
  form: FormGroup<TControl>;
  valueChanges: Observable<Partial<{[K in keyof TControl]: ɵValue<TControl[K]>}> | undefined>;
  valid: Signal<boolean>;
  count: Signal<number>;
} {
  const lumber = loggerOf('injectFilter');
  const router = inject(Router);
  const route = inject(ActivatedRoute);

  const keys = Object.keys(form.controls) as (keyof typeof form.controls)[];

  const queryParamChanges = route.queryParamMap.pipe(
    takeUntilDestroyed(),
    map((params) => keys.reduce((acc, curr) => ({...acc, [curr]: params.getAll(curr as string)}), {})),
    distinctUntilChanged(),
    shareReplay(1),
  );

  const valueChanges = merge(queryParamChanges, form.valueChanges) as Observable<Partial<{[K in keyof TControl]: ɵValue<TControl[K]>}>>;

  const valid = injectIsValid(form);

  // Calculate count of active filters
  const count = computedFrom(
    [valueChanges],
    map(([form]) =>
      !form
        ? 0
        : keys.reduce(
            (_count, fieldName) => _count + (Array.isArray(form[fieldName]) ? (form[fieldName] as []).length : form[fieldName] ? 1 : 0),
            0,
          ),
    ),
  );

  // Subscribe to form to set params on change
  form.valueChanges.pipe(takeUntilDestroyed(), distinctUntilChanged()).subscribe((queryParams) => {
    lumber.info('filterFormValueChanges', 'Set query params', queryParams);
    void router.navigate([], {
      relativeTo: route,
      queryParamsHandling: 'merge',
      queryParams,
    });
  });

  // Subscribe to route to set the form filter on change
  queryParamChanges.subscribe((controls: {[key: string]: string[]}) => {
    for (const key in controls) {
      const params = controls[key];
      if (Array.isArray(form.controls[key as keyof typeof form.controls].value)) {
        if (params.length > 0) {
          form.controls[key as keyof typeof form.controls].patchValue(
            synchronizeArrays(form.controls[key as keyof typeof form.controls].value, params),
            {emitEvent: false, onlySelf: true},
          );
        }
      } else {
        if (params[0] !== undefined && n_from(params[0]) !== form.controls[key as keyof typeof form.controls].value) {
          form.controls[key as keyof typeof form.controls].patchValue(n_from(params[0]), {emitEvent: false, onlySelf: true});
        }
      }
    }
  });

  return {
    form,
    valueChanges,
    valid,
    count,
  };
}

function synchronizeArrays(originalArray: number[], newArray: string[]): number[] {
  const originalSet = new Set(originalArray);
  const newSet = new Set(newArray.map(n_from));

  const toAdd = [...newSet].filter((item) => !originalSet.has(item));
  const toRemove = [...originalSet].filter((item) => !newSet.has(item));

  return [...originalArray.filter((item) => !toRemove.includes(item)), ...toAdd];
}
