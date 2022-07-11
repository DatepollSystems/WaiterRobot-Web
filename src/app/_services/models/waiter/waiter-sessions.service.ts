import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {SessionResponse} from '../../../_models/waiterrobot-backend';
import {WaitersService} from './waiters.service';
import {AbstractModelService} from '../abstract-model.service';

import {SessionModel} from '../../../_models/user/session.model';

@Injectable({
  providedIn: 'root',
})
export class WaiterSessionsService extends AbstractModelService<SessionModel> {
  constructor(httpService: HttpClient, waitersService: WaitersService) {
    super(httpService, '/config/waiter/session');
    waitersService.singleChange.subscribe((waiter) => this.setGetAllParams([{key: 'waiterId', value: waiter?.id}]));
  }

  protected convert(data: any): SessionModel {
    return new SessionModel(data as SessionResponse);
  }

  public setGetAllWaiterId(id: number): void {
    this.setGetAllParams([{key: 'waiterId', value: id}]);
  }
}
