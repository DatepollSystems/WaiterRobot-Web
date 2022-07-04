import {Injectable} from '@angular/core';

import {HttpService} from '../http.service';
import {OrganisationsService} from './organisation/organisations.service';
import {AbstractSelectableModelService} from './abstract-model.service';

import {EventModel} from '../../_models/event.model';
import {GetEventOrLocationResponse} from '../../_models/waiterrobot-backend';

@Injectable({
  providedIn: 'root',
})
export class EventsService extends AbstractSelectableModelService<EventModel> {
  protected selectedStorageKey = 'selected_event';

  constructor(httpService: HttpService, organisationsService: OrganisationsService) {
    super(httpService, '/config/event');

    this.setGetAllParams([{key: 'organisationId', value: organisationsService.getSelected()?.id}]);
    organisationsService.selectedChange.subscribe((org) => {
      this.setGetAllParams([{key: 'organisationId', value: org?.id}]);
    });
  }

  protected convert(data: GetEventOrLocationResponse): EventModel {
    return new EventModel(data);
  }
}
