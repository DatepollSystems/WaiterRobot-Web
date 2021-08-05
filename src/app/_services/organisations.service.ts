import {Injectable} from '@angular/core';

import {HttpService} from './http.service';
import {ASelectableModelService} from './a-selectable-model.service';

import {OrganisationModel} from '../_models/organisation.model';

@Injectable({
  providedIn: 'root',
})
export class OrganisationsService extends ASelectableModelService<OrganisationModel> {
  protected selectedStorageKey = 'selected_org';

  constructor(httpService: HttpService) {
    super(httpService, '/config/organisation');
  }

  protected convert(data: any): OrganisationModel {
    return new OrganisationModel(data);
  }
}
