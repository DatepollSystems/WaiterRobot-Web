import {inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {Observable, map} from 'rxjs';

import {n_from} from 'dfts-helper';
import {filterNil} from 'ngxtension/filter-nil';

export function injectIdParam$(): Observable<number> {
  return inject(ActivatedRoute).paramMap.pipe(
    map((params) => params.get('id')),
    filterNil(),
    map(n_from),
  );
}
