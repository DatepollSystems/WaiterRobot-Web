import {Injectable} from '@angular/core';

import {HttpService} from './http.service';
import {AbstractModelService} from './abstract-model.service';

import {TableGroupModel} from '../_models/table-group.model';
import {EventsService} from './events.service';

@Injectable({
  providedIn: 'root',
})
export class TableGroupsService extends AbstractModelService<TableGroupModel> {
  constructor(httpService: HttpService, private eventsService: EventsService) {
    super(httpService, '/config/table/group');

    this.setGetAllUrl('/config/table/group?event_id=' + this.eventsService.getSelected()?.id);
    this.eventsService.selectedChange.subscribe((event) => {
      this.setGetAllUrl('/config/table/group?event_id=' + event?.id);
    });
  }

  protected convert(data: any): TableGroupModel {
    return new TableGroupModel(data);
  }
}
