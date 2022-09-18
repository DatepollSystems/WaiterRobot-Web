import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {ProductGroupModel} from '../../../_models/product/product-group.model';

import {GetProductGroupResponse} from '../../../_models/waiterrobot-backend';
import {AbstractModelService} from '../abstract-model.service';
import {EventsService} from '../events.service';

@Injectable({
  providedIn: 'root',
})
export class ProductGroupsService extends AbstractModelService<ProductGroupModel> {
  override url = '/config/product/group';

  constructor(httpService: HttpClient, eventsService: EventsService) {
    super(httpService);

    this.setGetAllParams([{key: 'eventId', value: eventsService.getSelected()?.id}]);
    eventsService.selectedChange.subscribe((event) => {
      if (event) {
        this.setGetAllParams([{key: 'eventId', value: event.id}]);
        this.getAll();
      }
    });
  }

  protected convert(data: any): ProductGroupModel {
    return new ProductGroupModel(data as GetProductGroupResponse);
  }
}
