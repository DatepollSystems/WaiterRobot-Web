import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {BehaviorSubject, combineLatest, Observable, switchMap, tap} from 'rxjs';

import {HasGetAll} from 'dfx-helper';

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
    return combineLatest([this.trigger, this.organisationService.getSelectedNotNull$]).pipe(
      switchMap(([, {id: organisationId}]) => this.httpClient.get<DuplicateWaiterResponse[]>(this.url, {params: {organisationId}})),
    );
  }

  public merge(mergeDto: MergeWaiterDto): Observable<unknown> {
    return this.httpClient.put('/config/waiter/duplicates/merge', mergeDto).pipe(tap(() => this.trigger.next(true)));
  }
}
