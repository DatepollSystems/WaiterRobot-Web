import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {combineLatest, Observable, switchMap, tap} from 'rxjs';

import {s_from} from 'dfts-helper';
import {HasDelete, HasGetAll} from 'dfx-helper';

import {GetWaiterResponse} from '../../../_shared/waiterrobot-backend';
import {OrganisationsService} from '../../organisations/_services/organisations.service';
import {WaitersService} from './waiters.service';

@Injectable({providedIn: 'root'})
export class OrganisationWaitersService implements HasGetAll<GetWaiterResponse>, HasDelete<GetWaiterResponse> {
  url = '/config/waiter';

  constructor(
    private httpClient: HttpClient,
    private organisationsService: OrganisationsService,
    private waitersService: WaitersService,
  ) {}

  getAll$(): Observable<GetWaiterResponse[]> {
    return combineLatest([this.waitersService.triggerGet$, this.organisationsService.getSelectedNotNull$]).pipe(
      switchMap(([, {id: organisationId}]) => this.httpClient.get<GetWaiterResponse[]>(this.url, {params: {organisationId}})),
    );
  }

  delete$(id: number): Observable<unknown> {
    return this.httpClient.delete(`${this.url}/${s_from(id)}`).pipe(tap(() => this.waitersService.triggerGet$.next(true)));
  }
}
