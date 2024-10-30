import {Injectable, inject} from '@angular/core';

import {switchMap} from 'rxjs';

import {injectAPI} from '@shared/api';

import {OrganisationsUsersService} from '../../organisations/_services/organisations-users.service';

@Injectable({
  providedIn: 'root',
})
export class UsersOrganisationsService {
  #api = injectAPI();
  #triggerGet$ = inject(OrganisationsUsersService).triggerGet$;

  getByUserId$(userId: number) {
    return this.#triggerGet$.pipe(switchMap(() => this.#api.get('/v1/config/user/organisations', {params: {query: {userId}}})));
  }
}
