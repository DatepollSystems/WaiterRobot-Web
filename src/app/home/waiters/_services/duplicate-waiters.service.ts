import {HttpClient} from '@angular/common/http';
import {Injectable, inject} from '@angular/core';

import {BehaviorSubject, Observable, combineLatest, switchMap, tap} from 'rxjs';

import {HasGetAll} from 'dfx-helper';

import {SelectedOrganisationService} from '@shared/services/selected-organisation.service';
import {DuplicateWaiterResponse, MergeWaiterDto} from '@shared/waiterrobot-backend';

@Injectable({providedIn: 'root'})
export class DuplicateWaitersService implements HasGetAll<DuplicateWaiterResponse> {
  url = '/config/waiter/duplicates';

  private httpClient = inject(HttpClient);
  private selectedOrganisationService = inject(SelectedOrganisationService);

  trigger = new BehaviorSubject(true);

  getAll$(): Observable<DuplicateWaiterResponse[]> {
    return combineLatest([this.trigger, this.selectedOrganisationService.selectedIdNotNull$]).pipe(
      switchMap(([, organisationId]) =>
        this.httpClient.get<DuplicateWaiterResponse[]>(this.url, {
          params: {organisationId},
        }),
      ),
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
