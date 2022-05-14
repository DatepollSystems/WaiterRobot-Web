import {Injectable} from '@angular/core';
import {HttpService} from '../../http.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserSettingsService {
  constructor(private httpService: HttpService) {}

  public changeEmail(dto: UpdateEmailDto): Observable<any> {
    return this.httpService.put('/user/email', dto, undefined, 'updateEmail');
  }

  public changePassword(dto: UpdatePasswordDto): Observable<any> {
    return this.httpService.put('/user/password', dto, undefined, 'updatePassword');
  }
}

export class UpdatePasswordDto {
  constructor(public readonly old_password: string, public readonly new_password: string) {}
}

export class UpdateEmailDto {
  constructor(public readonly email_address: string) {}
}
