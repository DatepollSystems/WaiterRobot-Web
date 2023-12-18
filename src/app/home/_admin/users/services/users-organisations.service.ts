import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {Observable, switchMap} from 'rxjs';

import {IdAndNameResponse} from '../../../../_shared/waiterrobot-backend';
import {OrganisationsUsersService} from '../../../organisations/_services/organisations-users.service';

@Injectable({
  providedIn: 'root',
})
export class UsersOrganisationsService {
  constructor(
    private httpClient: HttpClient,
    private organisationsUsersService: OrganisationsUsersService,
  ) {}

  getByUserId$(userId: number): Observable<IdAndNameResponse[]> {
    return this.organisationsUsersService.triggerGet$.pipe(
      switchMap(() => this.httpClient.get<IdAndNameResponse[]>('/config/user/organisations', {params: {userId}})),
    );
  }
}
