import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {GetProductWithGroupResponse} from '../../../_models/waiterrobot-backend';
import {EventsService} from '../events.service';
import {AbstractModelService} from '../abstract-model.service';

import {ProductModel} from '../../../_models/product/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService extends AbstractModelService<ProductModel> {
  constructor(httpService: HttpClient, private eventsService: EventsService) {
    super(httpService, '/config/product');

    this.setGetAllParams([{key: 'eventId', value: eventsService.getSelected()?.id}]);
    this.eventsService.selectedChange.subscribe((event) => {
      if (event) {
        this.setGetAllParams([{key: 'eventId', value: event.id}]);
        this.getAll();
      }
    });
  }

  public setSelectedEventGetAllUrl(): void {
    this.setGetAllParams([{key: 'eventId', value: this.eventsService.getSelected()?.id}]);
  }

  protected convert(data: any): ProductModel {
    return new ProductModel(data as GetProductWithGroupResponse);
  }
}
