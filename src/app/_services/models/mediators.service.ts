import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {AbstractModelService} from './abstract-model.service';
import {GetMediatorResponse} from '../../_models/waiterrobot-backend';

import {MediatorModel} from '../../_models/mediator.model';

@Injectable({
  providedIn: 'root',
})
export class MediatorsService extends AbstractModelService<MediatorModel> {
  url = '/config/mediator';

  constructor(httpService: HttpClient) {
    super(httpService);
  }

  protected convert(data: any): MediatorModel {
    return new MediatorModel(data as GetMediatorResponse);
  }
}
