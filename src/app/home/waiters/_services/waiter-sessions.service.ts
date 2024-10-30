import {Injectable} from '@angular/core';

import {BehaviorSubject, switchMap, tap} from 'rxjs';

import {injectAPI} from '@shared/api';

@Injectable({providedIn: 'root'})
export class WaiterSessionsService {
  triggerGet$ = new BehaviorSubject(true);

  #api = injectAPI();

  getByParent$(waiterId: number) {
    return this.triggerGet$.pipe(switchMap(() => this.#api.get('/v1/config/waiter/session', {params: {query: {waiterId}}})));
  }

  delete$(id: number) {
    return this.#api.delete('/v1/config/waiter/session/{id}', {params: {path: {id}}}).pipe(
      tap(() => {
        this.triggerGet$.next(true);
      }),
    );
  }
}
