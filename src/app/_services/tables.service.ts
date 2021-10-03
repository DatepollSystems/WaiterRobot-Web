import {Injectable} from '@angular/core';

import {HttpService} from './http.service';
import {AbstractModelService} from './abstract-model.service';

import {TableModel} from '../_models/table.model';
import {EventsService} from './events.service';

@Injectable({
  providedIn: 'root',
})
export class TablesService extends AbstractModelService<TableModel> {
  constructor(httpService: HttpService, private eventsService: EventsService) {
    super(httpService, '/config/table');

    this.setGetAllUrl('/config/table?event_id=' + this.eventsService.getSelected()?.id);
    this.eventsService.selectedChange.subscribe((event) => {
      this.setGetAllUrl('/config/table?event_id=' + event?.id);
    });
  }

  protected convert(data: any): TableModel {
    return new TableModel(data);
  }
}
