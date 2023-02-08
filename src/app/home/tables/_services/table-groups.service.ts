import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AbstractModelService} from '../../../_shared/services/abstract-model.service';

import {GetTableGroupResponse} from '../../../_shared/waiterrobot-backend';
import {EventsService} from '../../events/_services/events.service';

import {TableGroupModel} from '../_models/table-group.model';

@Injectable()
export class TableGroupsService extends AbstractModelService<TableGroupModel> {
  override url = '/config/table/group';

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

  protected convert(data: any): TableGroupModel {
    return new TableGroupModel(data as GetTableGroupResponse);
  }
}
