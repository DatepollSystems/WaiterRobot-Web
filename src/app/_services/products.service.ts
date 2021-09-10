import {Injectable} from '@angular/core';
import {AModelService} from 'dfx-helper';

import {ProductsModel} from '../_models/products';
import {HttpService} from './http.service';
import {EventsService} from './events.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService extends AModelService<ProductsModel> {

  constructor(httpService: HttpService, private eventsService: EventsService) {
    super(httpService, '/config/product?event_id=' + eventsService.getSelected()?.id);

    this.eventsService.selectedChange.subscribe(value => {
      this.getAllUrl = '/config/product?event_id=' + value?.id;
    });
  }

  protected convert(data: any): ProductsModel {
    return new ProductsModel(data);
  }
}
