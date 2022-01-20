import {Injectable} from '@angular/core';

import {HttpService} from '../http.service';
import {EventsService} from './events.service';
import {AbstractModelService} from './abstract-model.service';

import {ProductsModel} from '../../_models/products';

@Injectable({
  providedIn: 'root',
})
export class ProductsService extends AbstractModelService<ProductsModel> {
  constructor(httpService: HttpService, private eventsService: EventsService) {
    super(httpService, '/config/product');

    this.setGetAllParams([{key: 'event_id', value: eventsService.getSelected()?.id}]);
    this.eventsService.selectedChange.subscribe((event) => {
      this.setGetAllParams([{key: 'event_id', value: event?.id}]);
    });
  }

  protected convert(data: any): ProductsModel {
    return new ProductsModel(data);
  }
}
