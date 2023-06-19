import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {notNullAndUndefined} from 'dfts-helper';
import {HasGetAll, HasGetSingle} from 'dfx-helper';
import {BehaviorSubject, filter, map, Observable, switchMap, tap, timer} from 'rxjs';
import {NotificationService} from '../../_shared/notifications/notification.service';

import {GetOrderResponse} from '../../_shared/waiterrobot-backend';
import {EventsService} from '../events/_services/events.service';

@Injectable({providedIn: 'root'})
export class OrdersService implements HasGetAll<GetOrderResponse>, HasGetSingle<GetOrderResponse> {
  url = '/config/order';

  constructor(private httpClient: HttpClient, private eventsService: EventsService, private notificationService: NotificationService) {}

  public readonly refreshIn = 30;

  public triggerRefresh = new BehaviorSubject<boolean>(true);

  countdown$ = (): Observable<number> =>
    this.triggerRefresh.pipe(
      switchMap(() => timer(0, 1000)),
      map((tick) => this.refreshIn - (tick % this.refreshIn))
    );

  getAll$(): Observable<GetOrderResponse[]> {
    return this.triggerRefresh.pipe(
      switchMap(() => timer(0, this.refreshIn * 1000)),
      switchMap(() => this.eventsService.getSelected$),
      filter(notNullAndUndefined),
      switchMap((event) => this.httpClient.get<GetOrderResponse[]>(this.url, {params: new HttpParams().set('eventId', event.id)})),
      tap(() => this.notificationService.tsuccess('HOME_ORDER_REFRESHED'))
    );
  }

  getSingle$(id: GetOrderResponse['id']): Observable<GetOrderResponse> {
    return this.triggerRefresh.pipe(
      switchMap(() => timer(0, this.refreshIn * 1000)),
      switchMap(() => this.httpClient.get<GetOrderResponse>(`${this.url}/${id}`)),
      tap(() => this.notificationService.tsuccess('HOME_ORDER_REFRESHED'))
    );
  }

  requeueOrder(id: GetOrderResponse['id']): Observable<unknown> {
    return this.httpClient.get(`${this.url}/${id}/requeue`).pipe(tap(() => this.triggerRefresh.next(true)));
  }
}
