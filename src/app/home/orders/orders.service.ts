import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';

import {BehaviorSubject, map, Observable, switchMap, take, tap, timer} from 'rxjs';

import {n_generate_int} from 'dfts-helper';
import {HasGetSingle} from 'dfx-helper';

import {NotificationService} from '../../_shared/notifications/notification.service';
import {GetOrderMinResponse, GetOrderResponse, PaginatedResponseGetOrderMinResponse} from '../../_shared/waiterrobot-backend';
import {Download, DownloadService} from '../_shared/services/download.service';
import {GetPaginatedFn, getPaginationParams, PageableDto} from '../_shared/services/pagination';
import {SelectedEventService} from '../events/_services/selected-event.service';

@Injectable({providedIn: 'root'})
export class OrdersService implements HasGetSingle<GetOrderResponse> {
  url = '/config/order';

  private httpClient = inject(HttpClient);
  private selectedEventService = inject(SelectedEventService);
  private downloadService = inject(DownloadService);
  private notificationService = inject(NotificationService);

  private readonly refreshIn = 30;

  public triggerRefresh = new BehaviorSubject<boolean>(true);

  countdown$ = (): Observable<number> =>
    this.triggerRefresh.pipe(
      switchMap(() => timer(0, 1000)),
      map((tick) => this.refreshIn - (tick % this.refreshIn)),
    );

  getSingle$(id: GetOrderResponse['id']): Observable<GetOrderResponse> {
    return this.triggerRefresh.pipe(
      switchMap(() => timer(0, this.refreshIn * 1000)),
      switchMap(() => this.httpClient.get<GetOrderResponse>(`${this.url}/${id}`)),
      tap(() => this.notificationService.tsuccess('HOME_ORDER_REFRESHED')),
    );
  }

  download$(): Observable<Download> {
    return this.selectedEventService.selectedIdNotNull$.pipe(
      take(1),
      switchMap((eventId) =>
        this.downloadService.download$(`${this.url}/export/${eventId}`, `orders_export_${n_generate_int(100, 9999)}.csv`),
      ),
    );
  }

  printAllTest(): void {
    this.selectedEventService.selectedIdNotNull$
      .pipe(
        take(1),
        switchMap((eventId) => this.httpClient.post(`${this.url}/test/all`, {}, {params: {eventId}})),
      )
      .subscribe(() => this.notificationService.tsuccess('SENT'));
  }

  requeueOrder$(id: GetOrderResponse['id']): Observable<unknown> {
    return this.httpClient.get(`${this.url}/${id}/requeue`).pipe(tap(() => this.triggerRefresh.next(true)));
  }

  requeueOrderPrinter$(id: GetOrderResponse['id'], printerId: number): Observable<unknown> {
    return this.httpClient.get(`${this.url}/${id}/requeue/${printerId}`).pipe(tap(() => this.triggerRefresh.next(true)));
  }

  getAllPaginated(
    options: PageableDto,
    tableGroupId?: number,
    tableId?: number,
    waiterId?: number,
    productIds?: number[],
  ): Observable<PaginatedResponseGetOrderMinResponse> {
    let params = getPaginationParams(options);
    if (tableGroupId) {
      params = params.append('tableGroupId', tableGroupId);
    }
    if (tableId) {
      params = params.append('tableId', tableId);
    }
    if (waiterId) {
      params = params.append('waiterId', waiterId);
    }
    if (productIds) {
      for (const productId of productIds) {
        params = params.append('productIds', productId);
      }
    }
    return this.triggerRefresh.pipe(
      switchMap(() => this.selectedEventService.selectedIdNotNull$),
      switchMap((eventId) =>
        this.httpClient.get<PaginatedResponseGetOrderMinResponse>(`${this.url}`, {
          params: params.append('eventId', eventId),
        }),
      ),
    );
  }

  getPaginatedFnByWaiterId(waiterId$: Observable<number>): GetPaginatedFn<GetOrderMinResponse> {
    return (options: PageableDto) =>
      waiterId$.pipe(
        switchMap((waiterId) =>
          this.httpClient.get<PaginatedResponseGetOrderMinResponse>(`${this.url}`, {
            params: getPaginationParams(options).append('waiterId', waiterId),
          }),
        ),
      );
  }

  getPaginatedFnByTableIdId(tableId$: Observable<number>): GetPaginatedFn<GetOrderMinResponse> {
    return (options: PageableDto) =>
      tableId$.pipe(
        switchMap((waiterId) =>
          this.httpClient.get<PaginatedResponseGetOrderMinResponse>(`${this.url}`, {
            params: getPaginationParams(options).append('tableId', waiterId),
          }),
        ),
      );
  }
}
