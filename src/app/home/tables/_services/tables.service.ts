import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AbstractModelService} from '../../../_shared/services/abstract-model.service';

import {GetTableResponse} from '../../../_shared/waiterrobot-backend';
import {EventsService} from '../../events/_services/events.service';

import {TableModel} from '../_models/table.model';

@Injectable()
export class TablesService extends AbstractModelService<TableModel> {
  override url = '/config/table';

  constructor(httpService: HttpClient, private eventsService: EventsService) {
    super(httpService);

    this.setGetAllParams([{key: 'eventId', value: this.eventsService.getSelected()?.id}]);
    this.eventsService.getSelected$.subscribe((event) => {
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
