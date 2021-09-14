import {Injectable} from '@angular/core';
import {AModelService} from 'dfx-helper';

import {HttpService} from './http.service';
import {WaiterModel} from '../_models/waiter.model';

@Injectable({
  providedIn: 'root',
})
export class WaitersService extends AModelService<WaiterModel> {
  constructor(httpService: HttpService) {
    super(httpService, '/config/waiter');
  }

  protected convert(jsonData: any): WaiterModel {
    return new WaiterModel(jsonData);
  }
}
