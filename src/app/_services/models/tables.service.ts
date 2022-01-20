import {Injectable} from '@angular/core';

import {HttpService} from '../http.service';
import {AbstractModelService} from './abstract-model.service';

import {TableModel} from '../../_models/table.model';
import {EventsService} from './events.service';

@Injectable({
  providedIn: 'root',
})
export class TablesService extends AbstractModelService<TableModel> {
  constructor(httpService: HttpService, private eventsService: EventsService) {
    super(httpService, '/config/table');

    this.setGetAllParams([{key: 'event_id', value: this.eventsService.getSelected()?.id}]);
    this.eventsService.selectedChange.subscribe((event) => {
      this.setGetAllParams([{key: 'event_id', value: event?.id}]);
    });
  }

  public setSelectedEventGetAllUrl(): void {
    this.setGetAllParams([{key: 'event_id', value: this.eventsService.getSelected()?.id}]);
  }

  protected convert(data: any): TableModel {
    return new TableModel(data);
  }
}
