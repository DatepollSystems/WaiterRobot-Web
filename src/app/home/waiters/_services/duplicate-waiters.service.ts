import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {notNullAndUndefined} from 'dfts-helper';
import {HasGetAll} from 'dfx-helper';
import {BehaviorSubject, combineLatest, filter, Observable, switchMap, tap} from 'rxjs';

import {DuplicateWaiterResponse, MergeWaiterDto} from '../../../_shared/waiterrobot-backend';
import {OrganisationsService} from '../../organisations/_services/organisations.service';

@Injectable({providedIn: 'root'})
export class DuplicateWaitersService implements HasGetAll<DuplicateWaiterResponse> {
  url = '/config/waiter/duplicates';

  constructor(
    private httpClient: HttpClient,
    private organisationService: OrganisationsService,
  ) {}

  trigger = new BehaviorSubject(true);

  getAll$(): Observable<DuplicateWaiterResponse[]> {
    return combineLatest([this.trigger, this.organisationService.getSelected$.pipe(filter(notNullAndUndefined))]).pipe(
      switchMap(([, organisation]) =>
        this.httpClient.get<DuplicateWaiterResponse[]>(this.url, {params: new HttpParams().set('organisationId', organisation.id)}),
      ),
    );
  }

  public merge(mergeDto: MergeWaiterDto): Observable<unknown> {
    return this.httpClient.put('/config/waiter/duplicates/merge', mergeDto).pipe(tap(() => this.trigger.next(true)));
  }
}
