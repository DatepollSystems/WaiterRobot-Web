import {Injectable} from '@angular/core';

import {HttpService} from '../http.service';
import {AbstractModelService} from './abstract-model.service';

import {SessionModel} from '../../_models/session.model';

@Injectable({
  providedIn: 'root',
})
export class SessionsService extends AbstractModelService<SessionModel> {
  constructor(httpService: HttpService) {
    super(httpService, '/user/sessions');
  }

  protected convert(data: any): SessionModel {
    return new SessionModel(data);
  }
}
