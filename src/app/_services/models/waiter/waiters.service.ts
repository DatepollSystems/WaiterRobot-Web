import {Injectable} from '@angular/core';

import {HttpService} from '../../http.service';
import {AbstractModelService} from '../abstract-model.service';

import {WaiterModel} from '../../../_models/waiter/waiter.model';
import {OrganisationsService} from '../organisation/organisations.service';

@Injectable({
  providedIn: 'root',
})
export class WaitersService extends AbstractModelService<WaiterModel> {
  constructor(httpService: HttpService, private organisationService: OrganisationsService) {
    super(httpService, '/config/waiter');
    this.setGetAllParams([{key: 'organisationId', value: this.organisationService.getSelected()?.id}]);
    this.organisationService.selectedChange.subscribe((org) => {
      if (org) {
        this.setGetAllParams([{key: 'organisationId', value: org?.id}]);
        this.getAll();
      }
    });
  }

  public setSelectedOrganisationGetAllUrl(): void {
    this.setGetAllParams([{key: 'organisationId', value: this.organisationService.getSelected()?.id}]);
  }

  protected convert(jsonData: any): WaiterModel {
    return new WaiterModel(jsonData);
  }
}
