import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {SessionModel} from '../../../_models/session.model';

import {SessionResponse} from '../../../_models/waiterrobot-backend';
import {AbstractModelService} from '../abstract-model.service';

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
