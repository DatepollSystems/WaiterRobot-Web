import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {SessionModel} from '../../user-settings/_models/session.model';

import {SessionResponse} from '../../../_shared/waiterrobot-backend';
import {AbstractModelService} from '../../../_shared/services/abstract-model.service';
import {WaitersService} from './waiters.service';

@Injectable()
export class WaiterSessionsService extends AbstractModelService<SessionModel> {
  url = '/config/waiter/session';

  constructor(httpService: HttpClient, waitersService: WaitersService) {
    super(httpService);
    waitersService.singleChange.subscribe((waiter) => this.setGetAllParams([{key: 'waiterId', value: waiter?.id}]));
  }

  protected convert(data: any): SessionModel {
    return new SessionModel(data as SessionResponse);
  }

  public setGetAllWaiterId(id: number): void {
    this.setGetAllParams([{key: 'waiterId', value: id}]);
  }
}