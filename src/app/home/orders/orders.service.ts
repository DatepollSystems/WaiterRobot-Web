import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {BehaviorSubject, filter, map, Observable, switchMap, tap, timer} from 'rxjs';

import {n_generate_int, notNullAndUndefined} from 'dfts-helper';
import {HasGetSingle} from 'dfx-helper';

import {NotificationService} from '../../_shared/notifications/notification.service';
import {Download, DownloadService} from '../../_shared/services/download.service';
import {GetPaginatedFn, getPaginationParams, PageableDto} from '../../_shared/services/services.interface';
import {GetOrderMinResponse, GetOrderResponse, PaginatedResponseGetOrderMinResponse} from '../../_shared/waiterrobot-backend';
import {EventsService} from '../events/_services/events.service';

@Injectable({providedIn: 'root'})
export class OrdersService implements HasGetSingle<GetOrderResponse> {
  url = '/config/order';

  constructor(
    private httpClient: HttpClient,
    private eventsService: EventsService,
    private downloadService: DownloadService,
    private notificationService: NotificationService,
  ) {}

  public readonly refreshIn = 30;

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
    return this.eventsService.getSelectedNotNull$.pipe(
      switchMap((event) =>
        this.downloadService.download$(`${this.url}/export/${event.id}`, `orders_export_${n_generate_int(100, 9999)}.csv`),
      ),
    );
  }

  requeueOrder$(id: GetOrderResponse['id']): Observable<unknown> {
    return this.httpClient.get(`${this.url}/${id}/requeue`).pipe(tap(() => this.triggerRefresh.next(true)));
  }

  requeueOrderPrinter$(id: GetOrderResponse['id'], printerId: number): Observable<unknown> {
    return this.httpClient.get(`${this.url}/${id}/requeue/${printerId}`).pipe(tap(() => this.triggerRefresh.next(true)));
  }

  getAllPaginatedFn(): GetPaginatedFn<GetOrderMinResponse> {
    return (options: PageableDto) =>
      this.triggerRefresh.pipe(
        switchMap(() => this.eventsService.getSelected$),
        filter(notNullAndUndefined),
        switchMap((eventId) =>
          this.httpClient.get<PaginatedResponseGetOrderMinResponse>(`${this.url}`, {
            params: getPaginationParams(options).append('eventId', eventId.id),
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
