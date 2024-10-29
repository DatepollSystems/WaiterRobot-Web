import {Injectable} from '@angular/core';

import {BehaviorSubject, map, switchMap, tap} from 'rxjs';

import {injectAPI} from '@shared/api';
import {SessionModel} from '@shared/model/session.model';
import {SessionResponse} from '@shared/waiterrobot-backend';

@Injectable({providedIn: 'root'})
export class WaiterSessionsService {
  triggerGet$ = new BehaviorSubject(true);

  #api = injectAPI();

  convert = (it: SessionResponse): SessionModel => new SessionModel(it);

  getByParent$(waiterId: number) {
    return this.triggerGet$.pipe(
      switchMap(() =>
        this.#api.get('/v1/config/waiter/session', {params: {query: {waiterId}}}).pipe(map((it) => it.map((iit) => this.convert(iit)))),
      ),
    );
  }

  delete$(id: number) {
    return this.#api.delete('/v1/config/waiter/session/{id}', {params: {path: {id}}}).pipe(
      tap(() => {
        this.triggerGet$.next(true);
      }),
    );
  }
}
