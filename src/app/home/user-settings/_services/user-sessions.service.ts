import {Injectable} from '@angular/core';

import {BehaviorSubject, map, switchMap} from 'rxjs';

import {injectAPI} from '@shared/api';
import {SessionModel} from '@shared/model/session.model';
import {SessionResponse} from '@shared/waiterrobot-backend';

@Injectable({providedIn: 'root'})
export class UserSessionsService {
  #api = injectAPI();

  triggerGet$ = new BehaviorSubject(true);

  convert = (it: SessionResponse): SessionModel => new SessionModel(it);

  delete$(id: number) {
    return this.#api.delete('/v1/user/sessions/{id}', {params: {path: {id}}});
  }

  getAll$() {
    return this.triggerGet$.pipe(switchMap(() => this.#api.get('/v1/user/sessions').pipe(map((it) => it.map((iit) => this.convert(iit))))));
  }
}
