import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {notNullAndUndefined, s_from} from 'dfts-helper';
import {HasDelete, HasGetAll} from 'dfx-helper';
import {combineLatest, filter, Observable, switchMap, tap} from 'rxjs';

import {GetWaiterResponse} from '../../../_shared/waiterrobot-backend';
import {OrganisationsService} from '../../organisations/_services/organisations.service';
import {WaitersService} from './waiters.service';

@Injectable({providedIn: 'root'})
export class OrganisationWaitersService implements HasGetAll<GetWaiterResponse>, HasDelete<GetWaiterResponse> {
  url = '/config/waiter';

  constructor(private httpClient: HttpClient, private organisationsService: OrganisationsService, private waitersService: WaitersService) {}

  getAll$(): Observable<GetWaiterResponse[]> {
    return combineLatest([this.waitersService.triggerGet$, this.organisationsService.getSelected$.pipe(filter(notNullAndUndefined))]).pipe(
      switchMap(([, organisation]) =>
        this.httpClient.get<GetWaiterResponse[]>(this.url, {params: new HttpParams().set('organisationId', organisation.id)})
      )
    );
  }

  delete$(id: number): Observable<unknown> {
    return this.httpClient.delete(`${this.url}/${s_from(id)}`).pipe(tap(() => this.waitersService.triggerGet$.next(true)));
  }
}
