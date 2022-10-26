import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {WaiterModel} from '../_models/waiter.model';

import {GetWaiterResponse} from '../../../_shared/waiterrobot-backend';
import {AbstractModelService} from '../../../_shared/services/abstract-model.service';
import {OrganisationsService} from '../../organisations/_services/organisations.service';

@Injectable()
export class WaitersService extends AbstractModelService<WaiterModel> {
  override url = '/config/waiter';

  constructor(httpService: HttpClient, private organisationService: OrganisationsService) {
    super(httpService);
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
