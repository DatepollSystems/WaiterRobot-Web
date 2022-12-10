import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {SessionModel} from '../_models/session.model';

import {SessionResponse} from '../../../_shared/waiterrobot-backend';
import {AbstractModelService} from '../../../_shared/services/abstract-model.service';

@Injectable({providedIn: 'root'})
export class UserSessionsService extends AbstractModelService<SessionModel> {
  override url = '/user/sessions';

  constructor(httpService: HttpClient) {
    super(httpService);
  }

  protected convert(data: any): SessionModel {
    return new SessionModel(data as SessionResponse);
  }
}
