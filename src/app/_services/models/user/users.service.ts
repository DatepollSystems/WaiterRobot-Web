import {Injectable} from '@angular/core';

import {HttpService} from '../../http.service';
import {AbstractModelService} from '../abstract-model.service';

import {UserModel} from '../../../_models/user/user.model';
import {GetUserResponse} from '../../../_models/waiterrobot-backend';

@Injectable({
  providedIn: 'root',
})
export class UsersService extends AbstractModelService<UserModel> {
  constructor(httpService: HttpService) {
    super(httpService, '/config/user');
  }

  protected convert(data: any): UserModel {
    return new UserModel(data as GetUserResponse);
  }
}
