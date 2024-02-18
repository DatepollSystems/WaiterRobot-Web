import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';

import {GetBillUnpaidReasonResponse} from '@shared/waiterrobot-backend';

import {HasDelete, HasGetAll, HasGetSingle} from 'dfx-helper';

import {BehaviorSubject, Observable, switchMap} from 'rxjs';
import {SelectedEventService} from '../../events/_services/selected-event.service';

@Injectable({providedIn: 'root'})
export class UnpaidReasonsService
  implements HasGetSingle<GetBillUnpaidReasonResponse>, HasGetAll<GetBillUnpaidReasonResponse>, HasDelete<GetBillUnpaidReasonResponse>
{
  url = '/config/billing/unpaid';

  private httpClient = inject(HttpClient);
  private selectedEventService = inject(SelectedEventService);

  public triggerRefresh = new BehaviorSubject<boolean>(true);

  getSingle$(id: GetBillUnpaidReasonResponse['id']): Observable<GetBillUnpaidReasonResponse> {
    return this.triggerRefresh.pipe(switchMap(() => this.httpClient.get<GetBillUnpaidReasonResponse>(`${this.url}/${id}`)));
  }

  getAll$(): Observable<GetBillUnpaidReasonResponse[]> {
    return this.triggerRefresh.pipe(
      switchMap(() => this.selectedEventService.selectedIdNotNull$),
      switchMap((eventId) => this.httpClient.get<GetBillUnpaidReasonResponse[]>(this.url, {params: {eventId}})),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  delete$(_: GetBillUnpaidReasonResponse['id']): Observable<unknown> {
    throw new Error('Method not implemented.');
  }
}
