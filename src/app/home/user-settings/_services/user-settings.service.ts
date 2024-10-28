import {HttpClient} from '@angular/common/http';
import {Injectable, inject} from '@angular/core';

import {Observable} from 'rxjs';

import {UpdateEmailDto, UpdatePasswordDto} from '@shared/waiterrobot-backend';

@Injectable({providedIn: 'root'})
export class UserSettingsService {
  #httpService = inject(HttpClient);

  public changeEmail(dto: UpdateEmailDto): Observable<unknown> {
    return this.#httpService.put('/user/email', dto);
  }

  public changePassword(dto: UpdatePasswordDto): Observable<unknown> {
    return this.#httpService.put('/user/password', dto);
  }
}
