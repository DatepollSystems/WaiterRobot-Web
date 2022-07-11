import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {SessionResponse} from '../../../_models/waiterrobot-backend';
import {AbstractModelService} from '../abstract-model.service';

import {SessionModel} from '../../../_models/user/session.model';

@Injectable({
  providedIn: 'root',
})
export class UserSessionsService extends AbstractModelService<SessionModel> {
  constructor(httpService: HttpClient) {
    super(httpService, '/user/sessions');
  }

  protected convert(data: any): SessionModel {
    return new SessionModel(data as SessionResponse);
  }
}
