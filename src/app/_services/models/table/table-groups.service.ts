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

    this.setGetAllParams([{key: 'eventId', value: this.eventsService.getSelected()?.id}]);
    this.eventsService.selectedChange.subscribe((event) => {
      if (event) {
        this.setGetAllParams([{key: 'eventId', value: event?.id}]);
        this.getAll();
      }
    });
  }

  protected convert(data: any): TableGroupModel {
    return new TableGroupModel(data);
  }
}
