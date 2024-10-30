import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';

import {BackendType, injectAPI} from '@shared/api';

@Injectable({providedIn: 'root'})
export class UserSettingsService {
  #api = injectAPI();

  public changeEmail(body: BackendType['UpdateEmailDto']): Observable<unknown> {
    return this.#api.put('/v1/user/email', {body});
  }

  public changePassword(body: BackendType['UpdatePasswordDto']): Observable<unknown> {
    return this.#api.put('/v1/user/password', {body});
  }
}
