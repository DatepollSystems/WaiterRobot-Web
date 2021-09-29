import {Injectable} from '@angular/core';

import {HttpService} from './http.service';
import {EventsService} from './events.service';
import {AbstractModelService} from './abstract-model.service';

import {ProductsModel} from '../_models/products';

@Injectable({
  providedIn: 'root',
})
export class ProductsService extends AbstractModelService<ProductsModel> {
  constructor(httpService: HttpService, private eventsService: EventsService) {
    super(httpService, '/config/product?event_id=' + eventsService.getSelected()?.id);

    this.eventsService.selectedChange.subscribe((value) => {
      this.getAllUrl = '/config/product?event_id=' + value?.id;
    });
  }

  protected convert(data: any): ProductsModel {
    return new ProductsModel(data);
  }
}
