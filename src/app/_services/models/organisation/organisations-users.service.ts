import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {AEntityService} from 'dfx-helper';

import {OrganisationUserResponse} from '../../../_models/waiterrobot-backend';

import {OrganisationUserModel} from '../../../_models/organisation/organisation-user.model';

@Injectable({
  providedIn: 'root',
})
export class OrganisationsUsersService extends AEntityService<string, OrganisationUserModel> {
  constructor(httpService: HttpClient) {
    super(httpService, '/config/organisation/users');

    this.globalUpdateUrl = '/config/organisation/{organisationId}/user/{uEmail}';
    this.globalDeleteUrl = '/config/organisation/{organisationId}/user/{uEmail}';
  }

  protected convert(data: any): OrganisationUserModel {
    return new OrganisationUserModel(data as OrganisationUserResponse);
  }
}
