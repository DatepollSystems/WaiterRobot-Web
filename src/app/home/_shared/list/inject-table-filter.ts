import {computed} from '@angular/core';
import {FormControl} from '@angular/forms';
import {map, startWith} from 'rxjs';
import {toSignal} from '@angular/core/rxjs-interop';

export function injectTableFilter() {
  const control = new FormControl('');

  const value$ = control.valueChanges.pipe(
    map((it) => it ?? ''),
    startWith(''),
  );
  const value = toSignal(value$, {requireSync: true});
  const isActive = computed(() => value().length > 0);

  return {
    control,
    value,
    value$,
    reset: () => {
      control.reset();
    },
    isActive,
  };
}
