import {Injectable} from '@angular/core';

import {HttpService} from '../http.service';

import {OrganisationUserModel} from '../../_models/organisation.model';
import {OrganisationsService} from './organisations.service';
import {AEntityService} from 'dfx-helper';

@Injectable({
  providedIn: 'root',
})
export class OrganisationsUsersService extends AEntityService<string, OrganisationUserModel> {
  constructor(httpService: HttpService, organisationsService: OrganisationsService) {
    super(httpService, '/config/organisation');

    const selected = organisationsService.getSelected();
    if (selected) {
      this.setGetAllUrl('/config/organisation/' + selected.id + '/users');
    }
  }

  protected convert(data: any): OrganisationUserModel {
    return new OrganisationUserModel(data);
  }
}
