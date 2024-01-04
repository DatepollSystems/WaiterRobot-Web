import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';

import {BehaviorSubject, map, Observable, switchMap, take, tap, timer} from 'rxjs';

import {Download, DownloadService} from '@home-shared/services/download.service';
import {getPaginationParams, PageableDto} from '@home-shared/services/pagination';
import {NotificationService} from '@shared/notifications/notification.service';
import {GetOrderResponse, PaginatedResponseGetOrderMinResponse} from '@shared/waiterrobot-backend';

import {n_generate_int} from 'dfts-helper';
import {HasGetSingle} from 'dfx-helper';

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
    tableIds?: number[],
    tableGroupIds?: number[],
    productIds?: number[],
    productGroupIds?: number[],
    waiterIds?: number[],
  ): Observable<PaginatedResponseGetOrderMinResponse> {
    let params = getPaginationParams(options);
    if (tableGroupIds) {
      for (const it of tableGroupIds) {
        params = params.append('tableGroupIds', it);
      }
    }
    if (tableIds) {
      for (const it of tableIds) {
        params = params.append('tableIds', it);
      }
    }
    if (waiterIds) {
      for (const it of waiterIds) {
        params = params.append('waiterIds', it);
      }
    }
    if (productIds) {
      for (const it of productIds) {
        params = params.append('productIds', it);
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
}
