import {inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {map, Observable} from 'rxjs';

import {filterNil} from 'ngxtension/filter-nil';

import {n_from} from 'dfts-helper';

export function injectIdParam$(): Observable<number> {
  return inject(ActivatedRoute).paramMap.pipe(
    map((params) => params.get('id')),
    filterNil(),
    map((it) => n_from(it)),
  );
}
