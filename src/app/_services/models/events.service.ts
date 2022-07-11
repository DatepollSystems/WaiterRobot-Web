import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {GetEventOrLocationResponse} from '../../_models/waiterrobot-backend';
import {OrganisationsService} from './organisation/organisations.service';
import {AbstractSelectableModelService} from './abstract-model.service';

import {EventModel} from '../../_models/event.model';

@Injectable({
  providedIn: 'root',
})
export class EventsService extends AbstractSelectableModelService<EventModel> {
  protected selectedStorageKey = 'selected_event';

  constructor(httpService: HttpClient, organisationsService: OrganisationsService) {
    super(httpService, '/config/event');

    this.setGetAllParams([{key: 'organisationId', value: organisationsService.getSelected()?.id}]);
    organisationsService.selectedChange.subscribe((org) => {
      this.setGetAllParams([{key: 'organisationId', value: org?.id}]);
    });
  }

  protected convert(data: any): EventModel {
    return new EventModel(data as GetEventOrLocationResponse);
  }
}
