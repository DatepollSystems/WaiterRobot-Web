import {Injectable} from '@angular/core';

import {HttpService} from '../http.service';
import {AbstractModelService} from './abstract-model.service';

import {SessionsModel} from '../../_models/session.model';

@Injectable({
  providedIn: 'root',
})
export class SessionsService extends AbstractModelService<SessionsModel> {
  constructor(httpService: HttpService) {
    super(httpService, '/auth/sessions');
  }

  protected convert(data: any): SessionsModel {
    return new SessionsModel(data);
  }
}
