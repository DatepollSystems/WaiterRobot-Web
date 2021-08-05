import {Injectable} from '@angular/core';

import {HttpService} from './http.service';
import {ASelectableModelService} from './a-selectable-model.service';

import {EventModel} from '../_models/event.model';
import {OrganisationsService} from './organisations.service';

@Injectable({
  providedIn: 'root',
})
export class EventsService extends ASelectableModelService<EventModel> {
  protected selectedStorageKey = 'selected_event';

  constructor(httpService: HttpService, private organisationsService: OrganisationsService) {
    super(httpService, '/config/event');

    this.organisationsService.selectedChange.subscribe(value => {
      this.getAllUrl = '/config/event?organisation_id=' + value?.id;
    });
  }

  protected convert(data: any): EventModel {
    return new EventModel(data);
  }
}
