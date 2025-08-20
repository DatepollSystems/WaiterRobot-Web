import {Injectable} from '@angular/core';

import {BehaviorSubject, Observable, map, shareReplay, switchMap, tap} from 'rxjs';

import {injectAPI} from '../api';

@Injectable({providedIn: 'root'})
export class DeadLettersService {
  #api = injectAPI();

  triggerGet$ = new BehaviorSubject(true);

  getAll$() {
    return this.triggerGet$.pipe(
      switchMap(() => this.#api.get('/v1/config/dead-letter')),
      shareReplay(1),
    );
  }

  getSingle$(id: number) {
    return this.getAll$().pipe(map((letters) => letters.find((it) => it.id === id)!));
  }

  delete$(id: number): Observable<unknown> {
    return this.#api
      .delete('/v1/config/dead-letter/{id}', {
        params: {
          path: {id},
        },
      })
      .pipe(
        tap(() => {
          this.triggerGet$.next(true);
        }),
      );
  }
}
