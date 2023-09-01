import {inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {map, Observable} from 'rxjs';

import {n_from} from 'dfts-helper';

export function getActivatedRouteIdParam(): Observable<number> {
  return inject(ActivatedRoute).paramMap.pipe(map((params) => n_from(params.get('id'))));
}
