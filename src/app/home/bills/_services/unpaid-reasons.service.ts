import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {HasCreateWithIdResponse, HasUpdateWithIdResponse} from '@shared/services/services.interface';

import {CreateBillUnpaidReasonDto, GetBillUnpaidReasonResponse, IdResponse, UpdateBillUnpaidReasonDto} from '@shared/waiterrobot-backend';
import {s_from} from 'dfts-helper';

import {HasDelete, HasGetAll, HasGetSingle} from 'dfx-helper';

import {BehaviorSubject, combineLatest, Observable, switchMap, tap} from 'rxjs';
import {SelectedEventService} from '../../_admin/events/_services/selected-event.service';

@Injectable({providedIn: 'root'})
export class UnpaidReasonsService
  implements
    HasGetSingle<GetBillUnpaidReasonResponse>,
    HasGetAll<GetBillUnpaidReasonResponse>,
    HasDelete<GetBillUnpaidReasonResponse>,
    HasCreateWithIdResponse<CreateBillUnpaidReasonDto>,
    HasUpdateWithIdResponse<UpdateBillUnpaidReasonDto>
{
  url = '/config/billing/unpaid';

  private httpClient = inject(HttpClient);
  private selectedEventService = inject(SelectedEventService);

  public triggerRefresh = new BehaviorSubject<boolean>(true);

  getSingle$(id: GetBillUnpaidReasonResponse['id']): Observable<GetBillUnpaidReasonResponse> {
    return this.triggerRefresh.pipe(switchMap(() => this.httpClient.get<GetBillUnpaidReasonResponse>(`${this.url}/${id}`)));
  }

  getAll$(): Observable<GetBillUnpaidReasonResponse[]> {
    return combineLatest([this.selectedEventService.selectedIdNotNull$, this.triggerRefresh]).pipe(
      switchMap(([eventId]) => this.httpClient.get<GetBillUnpaidReasonResponse[]>(this.url, {params: {eventId}})),
    );
  }

  create$(dto: CreateBillUnpaidReasonDto): Observable<IdResponse> {
    return this.httpClient.post<IdResponse>(this.url, dto).pipe(
      tap(() => {
        this.triggerRefresh.next(true);
      }),
    );
  }

  update$(dto: UpdateBillUnpaidReasonDto): Observable<IdResponse> {
    return this.httpClient.put<IdResponse>(this.url, dto).pipe(
      tap(() => {
        this.triggerRefresh.next(true);
      }),
    );
  }

  delete$(id: number): Observable<unknown> {
    return this.httpClient.delete(`${this.url}/${s_from(id)}`).pipe(
      tap(() => {
        this.triggerRefresh.next(true);
      }),
    );
  }
}
