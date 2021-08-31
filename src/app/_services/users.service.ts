import {Injectable} from '@angular/core';
import {AModelService} from 'dfx-helper';

import {HttpService} from './http.service';
import {UserModel} from '../_models/user.model';

@Injectable({
  providedIn: 'root',
})
export class EventsService extends AModelService<UserModel> {
  constructor(httpService: HttpService) {
    super(httpService, '/config/user');
  }

  protected convert(data: any): UserModel {
    return new UserModel(data);
  }
}
