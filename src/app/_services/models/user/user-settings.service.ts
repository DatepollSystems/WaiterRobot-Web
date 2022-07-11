import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {UpdateEmailDto, UpdatePasswordDto} from '../../../_models/waiterrobot-backend';

@Injectable({
  providedIn: 'root',
})
export class UserSettingsService {
  constructor(private httpService: HttpClient) {}

  public changeEmail(dto: UpdateEmailDto): Observable<any> {
    return this.httpService.put('/user/email', dto);
  }

  public changePassword(dto: UpdatePasswordDto): Observable<any> {
    return this.httpService.put('/user/password', dto);
  }
}
