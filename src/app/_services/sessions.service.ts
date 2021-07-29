import {Injectable} from '@angular/core';
import {AModelService} from 'dfx-helper';

import {SessionsModel} from '../_models/sessions';
import {HttpService} from './http.service';

@Injectable({
  providedIn: 'root',
})
export class SessionsService extends AModelService<SessionsModel>{
  protected getAllUrl = '/auth/getAllSessions';

  constructor(httpService: HttpService) {
    super(httpService, '/auth/sessions');
  }

  protected convert(data: any): SessionsModel {
    return new SessionsModel(data);
  }
}
