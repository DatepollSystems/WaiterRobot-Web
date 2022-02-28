import {Injectable} from '@angular/core';

import {HttpService} from '../../http.service';
import {EventsService} from '../events.service';
import {AbstractModelService} from '../abstract-model.service';

import {ProductModel} from '../../../_models/product/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService extends AbstractModelService<ProductModel> {
  constructor(httpService: HttpService, private eventsService: EventsService) {
    super(httpService, '/config/product');

    this.setGetAllParams([{key: 'event_id', value: eventsService.getSelected()?.id}]);
    this.eventsService.selectedChange.subscribe((event) => {
      this.setGetAllParams([{key: 'event_id', value: event?.id}]);
    });
  }

  public setSelectedEventGetAllUrl(): void {
    this.setGetAllParams([{key: 'event_id', value: this.eventsService.getSelected()?.id}]);
  }

  protected convert(data: any): ProductModel {
    return new ProductModel(data);
  }
}
