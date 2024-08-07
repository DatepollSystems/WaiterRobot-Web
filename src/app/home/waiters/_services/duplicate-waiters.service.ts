import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';

import {DuplicateWaiterResponse, MergeWaiterDto} from '@shared/waiterrobot-backend';

import {HasGetAll} from 'dfx-helper';

import {BehaviorSubject, combineLatest, Observable, switchMap, tap} from 'rxjs';
import {SelectedOrganisationService} from '../../_admin/organisations/_services/selected-organisation.service';

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
    return this.httpClient.put('/config/waiter/duplicates/merge', mergeDto).pipe(
      tap(() => {
        this.trigger.next(true);
      }),
    );
  }
}
