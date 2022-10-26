import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {AEntityService} from 'dfx-helper';

import {OrganisationUserModel} from '../_models/organisation-user.model';

import {OrganisationUserResponse} from '../../../_shared/waiterrobot-backend';

@Injectable({
  providedIn: 'root',
})
export class OrganisationsUsersService extends AEntityService<string, OrganisationUserModel> {
  override url = '/config/organisation/users';

  constructor(httpService: HttpClient) {
    super(httpService);

    this.globalUpdateUrl = '/config/organisation/{organisationId}/user/{uEmail}';
    this.globalDeleteUrl = '/config/organisation/{organisationId}/user/{uEmail}';
  }

  protected convert(data: any): OrganisationUserModel {
    return new OrganisationUserModel(data as OrganisationUserResponse);
  }
}
