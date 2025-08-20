import {Injectable, inject} from '@angular/core';

import {switchMap} from 'rxjs';

import {injectAPI} from '../../api';
import {OrganisationsUsersService} from '../organisations/organisations-users.service';

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
