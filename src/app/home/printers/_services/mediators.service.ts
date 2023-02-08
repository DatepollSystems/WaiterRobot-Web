import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {AEntityService} from 'dfx-helper';

import {GetMediatorResponse} from '../../../_shared/waiterrobot-backend';

import {OrganisationsService} from '../../organisations/_services/organisations.service';

import {MediatorModel} from '../_models/mediator.model';

@Injectable({
  providedIn: 'root',
})
export class MediatorsService extends AEntityService<string, MediatorModel> {
  url = '/config/mediator';

  constructor(httpService: HttpClient, organisationsService: OrganisationsService) {
    super(httpService);

    this.setGetAllParams([{key: 'organisationId', value: organisationsService.getSelected()?.id}]);
    organisationsService.getSelected$.subscribe((org) => {
      this.setGetAllParams([{key: 'organisationId', value: org?.id}]);
    });
  }

  protected convert(data: any): MediatorModel {
    return new MediatorModel(data as GetMediatorResponse);
  }
}
