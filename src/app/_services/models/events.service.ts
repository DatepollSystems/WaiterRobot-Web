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

    const selected = organisationsService.getSelected();
    if (selected) {
      this.setGetAllParams(new HttpParams().set('organisation_id', selected.id));
    }
    organisationsService.selectedChange.subscribe((value) => {
      if (value) {
        this.setGetAllParams(new HttpParams().set('organisation_id', value.id));
      }
    });
  }

  protected convert(data: any): EventModel {
    return new EventModel(data);
  }
}
