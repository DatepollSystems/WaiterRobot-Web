import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';

import {BehaviorSubject, combineLatest, Observable, switchMap, tap} from 'rxjs';

import {HasGetAll} from 'dfx-helper';

import {DuplicateWaiterResponse, MergeWaiterDto} from '../../../_shared/waiterrobot-backend';
import {SelectedOrganisationService} from '../../organisations/_services/selected-organisation.service';

@Injectable({providedIn: 'root'})
export class DuplicateWaitersService implements HasGetAll<DuplicateWaiterResponse> {
  url = '/config/waiter/duplicates';

  private httpClient = inject(HttpClient);
  private selectedOrganisationService = inject(SelectedOrganisationService);

  trigger = new BehaviorSubject(true);

  getAll$(): Observable<DuplicateWaiterResponse[]> {
    return combineLatest([this.trigger, this.selectedOrganisationService.selectedIdNotNull$]).pipe(
      switchMap(([, organisationId]) => this.httpClient.get<DuplicateWaiterResponse[]>(this.url, {params: {organisationId}})),
    );
  }

  public merge(mergeDto: MergeWaiterDto): Observable<unknown> {
    return this.httpClient.put('/config/waiter/duplicates/merge', mergeDto).pipe(tap(() => this.trigger.next(true)));
  }
}
