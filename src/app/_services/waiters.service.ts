import {Injectable} from '@angular/core';

import {HttpService} from './http.service';
import {AbstractModelService} from './abstract-model.service';

import {WaiterModel} from '../_models/waiter.model';
import {OrganisationsService} from './organisations.service';

@Injectable({
  providedIn: 'root',
})
export class WaitersService extends AbstractModelService<WaiterModel> {
  constructor(httpService: HttpService, private organisationService: OrganisationsService) {
    super(httpService, '/config/waiter');

    this.setGetAllUrl('/config/table?event_id=' + this.organisationService.getSelected()?.id);
    this.organisationService.selectedChange.subscribe((org) => {
      this.setGetAllUrl('/config/waiter?organisation_id=' + org?.id);
    });
  }

  public setSelectedOrganisationGetAllUrl(): void {
    this.setGetAllUrl('/config/waiter?organisation_id=' + this.organisationService.getSelected()?.id);
  }

  protected convert(jsonData: any): WaiterModel {
    return new WaiterModel(jsonData);
  }
}
