import {Injectable} from '@angular/core';

import {HttpService} from '../../http.service';
import {AbstractModelService} from '../abstract-model.service';

import {TableGroupModel} from '../../../_models/table/table-group.model';
import {EventsService} from '../events.service';

@Injectable({
  providedIn: 'root',
})
export class TableGroupsService extends AbstractModelService<TableGroupModel> {
  constructor(httpService: HttpService, private eventsService: EventsService) {
    super(httpService, '/config/table/group');

    this.setGetAllParams([{key: 'event_id', value: this.eventsService.getSelected()?.id}]);
    this.eventsService.selectedChange.subscribe((event) => {
      this.setGetAllParams([{key: 'event_id', value: event?.id}]);
    });
  }

  protected convert(data: any): TableGroupModel {
    return new TableGroupModel(data);
  }
}
