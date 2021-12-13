import {Injectable} from '@angular/core';

import {HttpService} from '../http.service';
import {OrganisationsService} from './organisations.service';
import {AbstractSelectableModelService} from './abstract-model.service';

import {EventModel} from '../../_models/event.model';

@Injectable({
  providedIn: 'root',
})
export class EventsService extends AbstractSelectableModelService<EventModel> {
  protected selectedStorageKey = 'selected_event';

  constructor(httpService: HttpService, private organisationsService: OrganisationsService) {
    super(httpService, '/config/event');

    this.setGetAllUrl('/config/event?organisation_id=' + this.organisationsService.getSelected()?.id);
    this.organisationsService.selectedChange.subscribe((value) => {
      this.setGetAllUrl('/config/event?organisation_id=' + value?.id);
    });
  }

  protected convert(data: any): EventModel {
    return new EventModel(data);
  }
}
