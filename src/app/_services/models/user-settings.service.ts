import {Injectable} from '@angular/core';
import {HttpService} from '../http.service';

@Injectable({
  providedIn: 'root',
})
export class UserSettingsService {
  constructor(private httpService: HttpService) {}

  public changeEmail(dto: UpdateEmailDto) {
    return this.httpService.put('/user/email', dto, undefined, 'updateEmail');
  }

  public changePassword(dto: UpdatePasswordDto) {
    return this.httpService.put('/user/password', dto, undefined, 'updatePassword');
  }
}

export class UpdatePasswordDto {
  constructor(public readonly old_password: string, public readonly new_password: string) {}
}

export class UpdateEmailDto {
  constructor(public readonly email_address: string) {}
}
