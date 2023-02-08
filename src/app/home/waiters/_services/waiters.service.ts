import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AbstractModelService} from '../../../_shared/services/abstract-model.service';

import {GetWaiterResponse} from '../../../_shared/waiterrobot-backend';
import {OrganisationsService} from '../../organisations/_services/organisations.service';

import {WaiterModel} from '../_models/waiter.model';

@Injectable()
export class WaitersService extends AbstractModelService<WaiterModel> {
  override url = '/config/waiter';

  constructor(httpService: HttpClient, private organisationService: OrganisationsService) {
    super(httpService);
    this.setGetAllParams([{key: 'organisationId', value: this.organisationService.getSelected()?.id}]);
    this.organisationService.getSelected$.subscribe((org) => {
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
