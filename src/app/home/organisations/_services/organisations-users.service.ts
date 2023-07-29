import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, switchMap, tap} from 'rxjs';

import {OrganisationUserDto, OrganisationUserResponse} from '../../../_shared/waiterrobot-backend';
import {EventsService} from '../../events/_services/events.service';

@Injectable({
  providedIn: 'root',
})
export class OrganisationsUsersService {
  url = '/config/organisation/users';

  constructor(
    private httpClient: HttpClient,
    private eventsService: EventsService,
  ) {}

  triggerGet$ = new BehaviorSubject(true);

  getByOrganisationId$(id: number): Observable<OrganisationUserResponse[]> {
    return this.triggerGet$.pipe(
      switchMap(() => this.httpClient.get<OrganisationUserResponse[]>(this.url, {params: new HttpParams().set('organisationId', id)})),
    );
  }

  delete$(organisationId: number, uEmail: string): Observable<unknown> {
    return this.httpClient.delete(`/config/organisation/${organisationId}/user/${uEmail}`).pipe(tap(() => this.triggerGet$.next(true)));
  }

  create$(organisationId: number, uEmail: string, dto: OrganisationUserDto): Observable<unknown> {
    return this.httpClient.put(`/config/organisation/${organisationId}/user/${uEmail}`, dto).pipe(tap(() => this.triggerGet$.next(true)));
  }
}
