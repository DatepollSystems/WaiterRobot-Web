import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {s_from} from 'dfts-helper';
import {BehaviorSubject, combineLatest, filter, Observable, switchMap} from 'rxjs';
import {tap} from 'rxjs/operators';
import {HasDelete, HasGetAll, notNullAndUndefined} from '../../../_shared/services/abstract-entity.service';

import {GetWaiterResponse} from '../../../_shared/waiterrobot-backend';
import {OrganisationsService} from '../../organisations/_services/organisations.service';

@Injectable({providedIn: 'root'})
export class OrganisationWaitersService implements HasGetAll<GetWaiterResponse>, HasDelete<GetWaiterResponse> {
  url = '/config/waiter';

  constructor(private httpClient: HttpClient, private organisationsService: OrganisationsService) {}

  triggerGet$ = new BehaviorSubject(true);

  getAll$(): Observable<GetWaiterResponse[]> {
    return combineLatest([this.triggerGet$, this.organisationsService.getSelected$.pipe(filter(notNullAndUndefined))]).pipe(
      switchMap(([, organisation]) =>
        this.httpClient.get<GetWaiterResponse[]>(this.url, {params: new HttpParams().set('organisationId', organisation.id)})
      )
    );
  }

  delete$(id: number): Observable<unknown> {
    return this.httpClient.delete(`${this.url}/${s_from(id)}`).pipe(tap(() => this.triggerGet$.next(true)));
  }
}
