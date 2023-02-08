import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AbstractModelService} from '../../../_shared/services/abstract-model.service';

import {GetProductGroupResponse} from '../../../_shared/waiterrobot-backend';
import {EventsService} from '../../events/_services/events.service';

import {ProductGroupModel} from '../_models/product-group.model';

@Injectable()
export class ProductGroupsService extends AbstractModelService<ProductGroupModel> {
  override url = '/config/product/group';

  constructor(httpService: HttpClient, eventsService: EventsService) {
    super(httpService);

    this.setGetAllParams([{key: 'eventId', value: eventsService.getSelected()?.id}]);
    eventsService.getSelected$.subscribe((event) => {
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
