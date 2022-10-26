import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {ProductModel} from '../_models/product.model';
import {GetProductMaxResponse} from '../../../_shared/waiterrobot-backend';
import {AbstractModelService} from '../../../_shared/services/abstract-model.service';

import {EventsService} from '../../events/_services/events.service';

@Injectable()
export class ProductsService extends AbstractModelService<ProductModel> {
  override url = '/config/product';

  constructor(httpService: HttpClient, private eventsService: EventsService) {
    super(httpService);

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
    return new ProductModel(data as GetProductMaxResponse);
  }
}
