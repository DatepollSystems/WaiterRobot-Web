import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';

import {UpdateEmailDto, UpdatePasswordDto} from '@shared/waiterrobot-backend';

import {Observable} from 'rxjs';

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
