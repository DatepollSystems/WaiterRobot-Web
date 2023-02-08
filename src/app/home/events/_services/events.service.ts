import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AbstractSelectableModelService} from '../../../_shared/services/abstract-model.service';

import {GetEventOrLocationResponse} from '../../../_shared/waiterrobot-backend';
import {OrganisationsService} from '../../organisations/_services/organisations.service';

import {EventModel} from '../_models/event.model';

@Injectable({
  providedIn: 'root',
})
export class EventsService extends AbstractSelectableModelService<EventModel> {
  override url = '/config/event';
  protected selectedStorageKey = 'selected_event';

  constructor(httpService: HttpClient, organisationsService: OrganisationsService) {
    super(httpService);

    this.setGetAllParams([{key: 'organisationId', value: organisationsService.getSelected()?.id}]);
    organisationsService.getSelected$.subscribe((org) => {
      this.setGetAllParams([{key: 'organisationId', value: org?.id}]);
    });
  }

  protected convert(data: any): EventModel {
    return new EventModel(data as GetEventOrLocationResponse);
  }
}
