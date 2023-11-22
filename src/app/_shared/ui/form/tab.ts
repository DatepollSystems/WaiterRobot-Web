import {Location} from '@angular/common';
import {inject, signal, Signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {distinctUntilChanged, map, startWith, tap} from 'rxjs';

import {computedFrom} from 'ngxtension/computed-from';

import {injectConfirmDialog} from '../question-dialog/question-dialog.component';

export function injectEditDelete<ID>(successFn: (it: ID) => void): (it: ID) => void {
  const confirmDialog = injectConfirmDialog();
  const location = inject(Location);

  return (it: ID): void =>
    void confirmDialog('DELETE_CONFIRMATION').then((result) => {
      if (result) {
        successFn(it);
        location.back();
      }
    });
}

export function injectIsValid(form: FormGroup) {
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

export function injectTabControls<Tab>(options: {isCreating?: Signal<boolean>; defaultTab: Tab; onlyEditingTabs?: Tab[]}): {
  activeTab: Signal<Tab>;
  navigateToTab: (tab: Tab) => void;
} {
  const route = inject(ActivatedRoute);
  const router = inject(Router);

  const {isCreating, defaultTab, onlyEditingTabs} = options;

  const activeTab = computedFrom(
    [
      isCreating ?? signal(false),
      route.queryParamMap.pipe(
        tap((it) => console.log('activeTab - Params', it)),
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
    });
  };

  return {
    activeTab,
    navigateToTab,
  };
}
