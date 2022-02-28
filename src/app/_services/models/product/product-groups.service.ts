import {Injectable} from '@angular/core';

import {HttpService} from '../../http.service';
import {AbstractModelService} from '../abstract-model.service';
import {EventsService} from '../events.service';

import {ProductGroupModel} from '../../../_models/product/product-group.model';

@Injectable({
  providedIn: 'root',
})
export class ProductGroupsService extends AbstractModelService<ProductGroupModel> {
  constructor(httpService: HttpService, private eventsService: EventsService) {
    super(httpService, '/config/product/group');

    this.setGetAllParams([{key: 'event_id', value: this.eventsService.getSelected()?.id}]);
    this.eventsService.selectedChange.subscribe((event) => {
      this.setGetAllParams([{key: 'event_id', value: event?.id}]);
    });
  }

  protected convert(data: any): ProductGroupModel {
    return new ProductGroupModel(data);
  }
}
