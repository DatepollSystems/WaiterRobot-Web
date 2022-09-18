import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {AEntityService} from 'dfx-helper';

import {MediatorModel} from '../../_models/mediator.model';

import {GetMediatorResponse} from '../../_models/waiterrobot-backend';

import {OrganisationsService} from './organisation/organisations.service';

@Injectable({
  providedIn: 'root',
})
export class MediatorsService extends AEntityService<string, MediatorModel> {
  url = '/config/mediator';

  constructor(httpService: HttpClient, organisationsService: OrganisationsService) {
    super(httpService);

    this.setGetAllParams([{key: 'organisationId', value: organisationsService.getSelected()?.id}]);
    organisationsService.selectedChange.subscribe((org) => {
      this.setGetAllParams([{key: 'organisationId', value: org?.id}]);
    });
  }

  protected convert(data: any): MediatorModel {
    return new MediatorModel(data as GetMediatorResponse);
  }
}
