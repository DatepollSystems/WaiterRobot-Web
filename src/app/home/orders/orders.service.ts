import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {n_generate_int, notNullAndUndefined} from 'dfts-helper';
import {HasGetSingle} from 'dfx-helper';
import {BehaviorSubject, filter, map, Observable, switchMap, tap, timer} from 'rxjs';
import {NotificationService} from '../../_shared/notifications/notification.service';
import {Download, DownloadService} from '../../_shared/services/download.service';
import {HasGetPaginated, PageableDto} from '../../_shared/services/services.interface';

import {GetOrderMinResponse, GetOrderResponse, PaginatedResponseGetOrderMinResponse} from '../../_shared/waiterrobot-backend';
import {EventsService} from '../events/_services/events.service';

@Injectable({providedIn: 'root'})
export class OrdersService implements HasGetPaginated<GetOrderMinResponse>, HasGetSingle<GetOrderResponse> {
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
      tap(() => this.notificationService.tsuccess('HOME_ORDER_REFRESHED')),
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
    return this.eventsService.getSelected$.pipe(
      filter(notNullAndUndefined),
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

  getByTableId$(id: number): Observable<GetOrderResponse[]> {
    return this.httpClient.get<GetOrderResponse[]>(this.url, {params: new HttpParams().set('tableId', id)});
  }

  getByWaiterId$(id: number): Observable<GetOrderResponse[]> {
    return this.httpClient.get<GetOrderResponse[]>(this.url, {params: new HttpParams().set('waiterId', id)});
  }

  getAllPaginated$(options: PageableDto): Observable<PaginatedResponseGetOrderMinResponse> {
    let params = new HttpParams();
    params = params.append('page', options.page ?? 0);
    params = params.append('size', options.size ?? 10);
    if (options.sort) {
      params = params.append('sort', options.sort);
    }
    if (options.query && options.query.length > 0) {
      params = params.append('query', options.query);
    }
    return this.triggerRefresh.pipe(
      switchMap(() => this.eventsService.getSelected$),
      filter(notNullAndUndefined),
      switchMap((event) => {
        params = params.append('eventId', event.id);
        return this.httpClient.get<PaginatedResponseGetOrderMinResponse>(`${this.url}/table`, {params});
      }),
    );
  }
}
