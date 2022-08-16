import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {TableModel} from '../../../_models/table/table.model';

import {GetTableResponse} from '../../../_models/waiterrobot-backend';
import {AbstractModelService} from '../abstract-model.service';
import {EventsService} from '../events.service';

@Injectable({
  providedIn: 'root',
})
export class TablesService extends AbstractModelService<TableModel> {
  override url = '/config/table';

  constructor(httpService: HttpClient, private eventsService: EventsService) {
    super(httpService);

    this.setGetAllParams([{key: 'eventId', value: this.eventsService.getSelected()?.id}]);
    this.eventsService.selectedChange.subscribe((event) => {
      if (event) {
        this.setGetAllParams([{key: 'eventId', value: event.id}]);
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
