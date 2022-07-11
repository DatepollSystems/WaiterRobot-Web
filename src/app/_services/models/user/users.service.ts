import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {GetUserResponse} from '../../../_models/waiterrobot-backend';
import {AbstractModelService} from '../abstract-model.service';

import {UserModel} from '../../../_models/user/user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService extends AbstractModelService<UserModel> {
  url = '/config/user';

  constructor(httpService: HttpClient) {
    super(httpService);
  }

  protected convert(data: any): UserModel {
    return new UserModel(data as GetUserResponse);
  }
}
