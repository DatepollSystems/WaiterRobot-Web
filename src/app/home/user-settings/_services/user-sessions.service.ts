import {Injectable} from '@angular/core';

import {BehaviorSubject, switchMap} from 'rxjs';

import {injectAPI} from '@shared/api';

@Injectable({providedIn: 'root'})
export class UserSessionsService {
  #api = injectAPI();

  triggerGet$ = new BehaviorSubject(true);

  delete$(id: number) {
    return this.#api.delete('/v1/user/sessions/{id}', {params: {path: {id}}});
  }

  getAll$() {
    return this.triggerGet$.pipe(switchMap(() => this.#api.get('/v1/user/sessions')));
  }
}
