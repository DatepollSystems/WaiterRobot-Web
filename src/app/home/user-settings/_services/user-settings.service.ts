import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';

import {UpdateEmailDto, UpdatePasswordDto} from '../../../_shared/waiterrobot-backend';

@Injectable({providedIn: 'root'})
export class UserSettingsService {
  constructor(private httpService: HttpClient) {}

  public changeEmail(dto: UpdateEmailDto): Observable<unknown> {
    return this.httpService.put('/user/email', dto);
  }

  public changePassword(dto: UpdatePasswordDto): Observable<unknown> {
    return this.httpService.put('/user/password', dto);
  }
}
