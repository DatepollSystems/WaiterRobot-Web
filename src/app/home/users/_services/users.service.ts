import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {UserModel} from '../_models/user.model';

import {GetUserResponse} from '../../../_shared/waiterrobot-backend';
import {AbstractModelService} from '../../../_shared/services/abstract-model.service';

@Injectable({providedIn: 'root'})
export class UsersService extends AbstractModelService<UserModel> {
  override url = '/config/user';

  constructor(httpService: HttpClient) {
    super(httpService);
  }

  protected convert(data: any): UserModel {
    return new UserModel(data as GetUserResponse);
  }
}
