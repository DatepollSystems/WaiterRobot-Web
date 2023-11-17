import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';

import {BehaviorSubject, Observable, switchMap, timer} from 'rxjs';

import {HasGetSingle} from 'dfx-helper';

import {GetPaginatedFn, getPaginationParams, PageableDto} from '../../../_shared/services/services.interface';
import {GetBillMinResponse, GetBillResponse, PaginatedResponseGetBillMinResponse} from '../../../_shared/waiterrobot-backend';
import {SelectedEventService} from '../../events/_services/selected-event.service';

@Injectable({providedIn: 'root'})
export class BillsService implements HasGetSingle<GetBillResponse> {
  url = '/config/billing';

  private httpClient = inject(HttpClient);
  private selectedEventService = inject(SelectedEventService);

  private readonly refreshIn = 30;

  public triggerRefresh = new BehaviorSubject<boolean>(true);

  getSingle$(id: GetBillResponse['id']): Observable<GetBillResponse> {
    return this.triggerRefresh.pipe(
      switchMap(() => timer(0, this.refreshIn * 1000)),
      switchMap(() => this.httpClient.get<GetBillResponse>(`${this.url}/${id}`)),
    );
  }

  getAllPaginatedFn(): GetPaginatedFn<GetBillMinResponse> {
    return (options: PageableDto) =>
      this.triggerRefresh.pipe(
        switchMap(() => this.selectedEventService.selectedIdNotNull$),
        switchMap((eventId) =>
          this.httpClient.get<PaginatedResponseGetBillMinResponse>(`${this.url}`, {
            params: getPaginationParams(options).append('eventId', eventId),
          }),
        ),
      );
  }

  getPaginatedFnByWaiterId(waiterId$: Observable<number>): GetPaginatedFn<GetBillMinResponse> {
    return (options: PageableDto) =>
      waiterId$.pipe(
        switchMap((waiterId) =>
          this.httpClient.get<PaginatedResponseGetBillMinResponse>(`${this.url}`, {
            params: getPaginationParams(options).append('waiterId', waiterId),
          }),
        ),
      );
  }

  getPaginatedFnByTableIdId(tableId$: Observable<number>): GetPaginatedFn<GetBillMinResponse> {
    return (options: PageableDto) =>
      tableId$.pipe(
        switchMap((waiterId) =>
          this.httpClient.get<PaginatedResponseGetBillMinResponse>(`${this.url}`, {
            params: getPaginationParams(options).append('tableId', waiterId),
          }),
        ),
      );
  }
}
