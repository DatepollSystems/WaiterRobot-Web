import {Injectable} from '@angular/core';

import {HttpService} from './http.service';
import {AbstractModelService} from './abstract-model.service';

import {WaiterModel} from '../_models/waiter.model';

@Injectable({
  providedIn: 'root',
})
export class WaitersService extends AbstractModelService<WaiterModel> {
  constructor(httpService: HttpService) {
    super(httpService, '/config/waiter');
  }

  protected convert(jsonData: any): WaiterModel {
    return new WaiterModel(jsonData);
  }
}
