import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {WaiterModel} from '../../../_models/waiter/waiter.model';

import {GetWaiterResponse} from '../../../_models/waiterrobot-backend';
import {AbstractModelService} from '../abstract-model.service';
import {OrganisationsService} from '../organisation/organisations.service';

@Injectable({
  providedIn: 'root',
})
export class WaitersService extends AbstractModelService<WaiterModel> {
  constructor(httpService: HttpClient, private organisationService: OrganisationsService) {
    super(httpService, '/config/waiter');
    this.setGetAllParams([{key: 'organisationId', value: this.organisationService.getSelected()?.id}]);
    this.organisationService.selectedChange.subscribe((org) => {
      if (org) {
        this.setGetAllParams([{key: 'organisationId', value: org.id}]);
        this.getAll();
      }
    });
  }

  public setSelectedOrganisationGetAllUrl(): void {
    this.setGetAllParams([{key: 'organisationId', value: this.organisationService.getSelected()?.id}]);
  }

  protected convert(data: any): WaiterModel {
    return new WaiterModel(data as GetWaiterResponse);
  }
}
