import {Injectable} from '@angular/core';

import {HttpService} from '../../http.service';
import {AbstractModelService} from '../abstract-model.service';

import {SessionModel} from '../../../_models/user/session.model';
import {SessionResponse} from '../../../_models/waiterrobot-backend';

@Injectable({
  providedIn: 'root',
})
export class UserSessionsService extends AbstractModelService<SessionModel> {
  constructor(httpService: HttpService) {
    super(httpService, '/user/sessions');
  }

  protected convert(data: any): SessionModel {
    return new SessionModel(data as SessionResponse);
  }
}
