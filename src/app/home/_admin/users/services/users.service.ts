import {Injectable} from '@angular/core';

import {BehaviorSubject, switchMap, tap} from 'rxjs';

import {APIType, injectAPI} from '@shared/api';
import {HasCreateWithIdResponse, HasUpdateWithIdResponse} from '@shared/services/custom-types';

@Injectable({providedIn: 'root'})
export class UsersService implements HasCreateWithIdResponse<APIType['CreateUserDto']>, HasUpdateWithIdResponse<APIType['UpdateUserDto']> {
  url = '/config/user';
  #api = injectAPI();

  triggerGet$ = new BehaviorSubject(true);

  getAll$() {
    return this.triggerGet$.pipe(switchMap(() => this.#api.get('/v1/config/user')));
  }

  getSingle$(id: number) {
    return this.#api.get('/v1/config/user/{id}', {params: {path: {id}}});
  }

  create$(body: APIType['CreateUserDto']) {
    return this.#api.post('/v1/config/user', {body}).pipe(
      tap(() => {
        this.triggerGet$.next(true);
      }),
    );
  }

  update$(body: APIType['UpdateUserDto']) {
    return this.#api.put('/v1/config/user', {body}).pipe(
      tap(() => {
        this.triggerGet$.next(true);
      }),
    );
  }

  delete$(id: number) {
    return this.#api.delete('/v1/config/user/{id}', {params: {path: {id}}}).pipe(
      tap(() => {
        this.triggerGet$.next(true);
      }),
    );
  }
}
