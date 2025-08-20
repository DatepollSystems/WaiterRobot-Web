import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';

import {APIType, injectAPI} from '../api';

@Injectable({providedIn: 'root'})
export class UserSettingsService {
  #api = injectAPI();

  public changeEmail(body: APIType['UpdateEmailDto']): Observable<unknown> {
    return this.#api.put('/v1/user/email', {body});
  }

  public changePassword(body: APIType['UpdatePasswordDto']): Observable<unknown> {
    return this.#api.put('/v1/user/password', {body});
  }
}
