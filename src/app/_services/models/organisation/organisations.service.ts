import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {GetOrganisationResponse} from '../../../_models/waiterrobot-backend';
import {AbstractSelectableModelService} from '../abstract-model.service';

import {OrganisationModel} from '../../../_models/organisation/organisation.model';

@Injectable({
  providedIn: 'root',
})
export class OrganisationsService extends AbstractSelectableModelService<OrganisationModel> {
  protected selectedStorageKey = 'selected_org';

  constructor(httpService: HttpClient) {
    super(httpService, '/config/organisation');
  }

  protected convert(data: any): OrganisationModel {
    return new OrganisationModel(data as GetOrganisationResponse);
  }
}
