import {Injectable} from '@angular/core';

import {HttpService} from '../http.service';
import {OrganisationsService} from './organisations.service';
import {AbstractSelectableModelService} from './abstract-model.service';

import {EventModel} from '../../_models/event.model';
import {HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EventsService extends AbstractSelectableModelService<EventModel> {
  protected selectedStorageKey = 'selected_event';

  constructor(httpService: HttpService, organisationsService: OrganisationsService) {
    super(httpService, '/config/event');

    this.setGetAllParams([{key: 'organisation_id', value: organisationsService.getSelected()?.id}]);
    organisationsService.selectedChange.subscribe((org) => {
      this.setGetAllParams([{key: 'organisation_id', value: org?.id}]);
    });
  }

  protected convert(data: any): EventModel {
    return new EventModel(data);
  }
}
