import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {UserModel} from '../../../_models/user/user.model';

import {GetUserResponse} from '../../../_models/waiterrobot-backend';
import {AbstractModelService} from '../abstract-model.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService extends AbstractModelService<UserModel> {
  override url = '/config/user';

  constructor(httpService: HttpClient) {
    super(httpService);
  }

  protected convert(data: any): UserModel {
    return new UserModel(data as GetUserResponse);
  }
}
