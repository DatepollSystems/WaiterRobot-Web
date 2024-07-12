import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';

import {GetWaiterResponse} from '@shared/waiterrobot-backend';

import {s_from} from 'dfts-helper';
import {HasDelete, HasGetAll} from 'dfx-helper';

import {combineLatest, Observable, switchMap, tap} from 'rxjs';
import {SelectedOrganisationService} from '../../_admin/organisations/_services/selected-organisation.service';
import {WaitersService} from './waiters.service';

@Injectable({providedIn: 'root'})
export class OrganisationWaitersService implements HasGetAll<GetWaiterResponse>, HasDelete<GetWaiterResponse> {
  url = '/config/waiter';

  private httpClient = inject(HttpClient);
  private waitersService = inject(WaitersService);
  private selectedOrganisationService = inject(SelectedOrganisationService);

  getAll$(): Observable<GetWaiterResponse[]> {
    return combineLatest([this.waitersService.triggerGet$, this.selectedOrganisationService.selectedIdNotNull$]).pipe(
      switchMap(([, organisationId]) => this.httpClient.get<GetWaiterResponse[]>(this.url, {params: {organisationId}})),
    );
  }

  delete$(id: number): Observable<unknown> {
    return this.httpClient.delete(`${this.url}/${s_from(id)}`).pipe(
      tap(() => {
        this.waitersService.triggerGet$.next(true);
      }),
    );
  }
}
