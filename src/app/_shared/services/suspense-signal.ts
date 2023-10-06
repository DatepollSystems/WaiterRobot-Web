import {Signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';

import {Observable} from 'rxjs';

import {SuspenseLax, suspensify} from '@jscutlery/operators';

export function toSuspenseSignal<T>(source$: Observable<T>): Signal<SuspenseLax<T>> {
  return toSignal(source$.pipe(suspensify({strict: false})), {
    requireSync: true,
  });
}
