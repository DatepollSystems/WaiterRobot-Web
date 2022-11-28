import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {OrganisationModel} from '../_models/organisation.model';

import {GetOrganisationResponse} from '../../../_shared/waiterrobot-backend';
import {AbstractSelectableModelService} from '../../../_shared/services/abstract-model.service';

@Injectable({
  providedIn: 'root',
})
export class OrganisationsService extends AbstractSelectableModelService<OrganisationModel> {
  override url = '/config/organisation';
  protected selectedStorageKey = 'selected_org';

  constructor(httpService: HttpClient) {
    super(httpService);
  }

  protected convert(data: any): OrganisationModel {
    return new OrganisationModel(data as GetOrganisationResponse);
  }
}