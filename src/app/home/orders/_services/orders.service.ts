import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {AbstractModelService} from '../../../_shared/services/abstract-model.service';

import {GetOrderResponse} from '../../../_shared/waiterrobot-backend';
import {EventsService} from '../../events/_services/events.service';
import {OrderModel} from '../_models/order.model';

@Injectable()
export class OrdersService extends AbstractModelService<OrderModel> {
  url = '/config/order';

  constructor(httpService: HttpClient, private eventsService: EventsService) {
    super(httpService);

    this.setGetAllParams([{key: 'eventId', value: this.eventsService.getSelected()?.id}]);
    this.eventsService.getSelected$.subscribe((event) => {
      if (event) {
        this.setGetAllParams([{key: 'eventId', value: event.id}]);
        this.getAll();
      }
    });
  }

  public setSelectedEventGetAllUrl(): void {
    this.setGetAllParams([{key: 'eventId', value: this.eventsService.getSelected()?.id}]);
  }

  protected convert(data: any): OrderModel {
    return new OrderModel(data as GetOrderResponse);
  }
}
