import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';

import {OrganisationUserDto, OrganisationUserResponse} from '@shared/waiterrobot-backend';

import {BehaviorSubject, Observable, switchMap, tap} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrganisationsUsersService {
  url = '/config/organisation/users';

  #httpClient = inject(HttpClient);

  triggerGet$ = new BehaviorSubject(true);

  getByOrganisationId$(organisationId: number): Observable<OrganisationUserResponse[]> {
    return this.triggerGet$.pipe(switchMap(() => this.#httpClient.get<OrganisationUserResponse[]>(this.url, {params: {organisationId}})));
  }

  delete$(organisationId: number, uEmail: string): Observable<unknown> {
    return this.#httpClient.delete(`/config/organisation/${organisationId}/user/${uEmail}`).pipe(
      tap(() => {
        this.triggerGet$.next(true);
      }),
    );
  }

  create$(organisationId: number, uEmail: string, dto: OrganisationUserDto): Observable<unknown> {
    return this.#httpClient.put(`/config/organisation/${organisationId}/user/${uEmail}`, dto).pipe(
      tap(() => {
        this.triggerGet$.next(true);
      }),
    );
  }
}
