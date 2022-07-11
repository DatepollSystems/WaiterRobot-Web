import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {GetTableResponse} from '../../../_models/waiterrobot-backend';
import {AbstractModelService} from '../abstract-model.service';
import {EventsService} from '../events.service';

import {TableModel} from '../../../_models/table/table.model';

@Injectable({
  providedIn: 'root',
})
export class TablesService extends AbstractModelService<TableModel> {
  constructor(httpService: HttpClient, private eventsService: EventsService) {
    super(httpService, '/config/table');

    this.setGetAllParams([{key: 'eventId', value: this.eventsService.getSelected()?.id}]);
    this.eventsService.selectedChange.subscribe((event) => {
      if (event) {
        this.setGetAllParams([{key: 'eventId', value: event?.id}]);
        this.getAll();
      }
    });
  }

  public setSelectedEventGetAllUrl(): void {
    this.setGetAllParams([{key: 'eventId', value: this.eventsService.getSelected()?.id}]);
  }

  protected convert(data: any): TableModel {
    return new TableModel(data as GetTableResponse);
  }
}
