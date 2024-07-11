import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';

import {IdAndNameResponse} from '@shared/waiterrobot-backend';

import {Observable, switchMap} from 'rxjs';
import {OrganisationsUsersService} from '../../../_admin/organisations/_services/organisations-users.service';

@Injectable({
  providedIn: 'root',
})
export class UsersOrganisationsService {
  #httpClient = inject(HttpClient);
  #organisationsUsersService = inject(OrganisationsUsersService);

  getByUserId$(userId: number): Observable<IdAndNameResponse[]> {
    return this.#organisationsUsersService.triggerGet$.pipe(
      switchMap(() => this.#httpClient.get<IdAndNameResponse[]>('/config/user/organisations', {params: {userId}})),
    );
  }
}
