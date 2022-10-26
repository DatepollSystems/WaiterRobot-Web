import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {OrderModel} from '../_models/order.model';

import {GetOrderResponse} from '../../../_shared/waiterrobot-backend';

import {AbstractModelService} from '../../../_shared/services/abstract-model.service';
import {EventsService} from '../../events/_services/events.service';

@Injectable()
export class OrdersService extends AbstractModelService<OrderModel> {
  url = '/config/order';

  constructor(httpService: HttpClient, private eventsService: EventsService) {
    super(httpService);

    this.setGetAllParams([{key: 'eventId', value: this.eventsService.getSelected()?.id}]);
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

  protected convert(data: any): OrderModel {
    return new OrderModel(data as GetOrderResponse);
  }
}
