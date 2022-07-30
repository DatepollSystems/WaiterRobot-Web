import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {SessionModel} from '../../../_models/session.model';

import {SessionResponse} from '../../../_models/waiterrobot-backend';
import {AbstractModelService} from '../abstract-model.service';
import {WaitersService} from './waiters.service';

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
