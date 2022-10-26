import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {ProductGroupModel} from '../_models/product-group.model';

import {GetProductGroupResponse} from '../../../_shared/waiterrobot-backend';
import {AbstractModelService} from '../../../_shared/services/abstract-model.service';
import {EventsService} from '../../events/_services/events.service';

@Injectable()
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
