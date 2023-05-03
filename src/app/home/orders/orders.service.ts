import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {notNullAndUndefined} from 'dfts-helper';
import {HasGetAll} from 'dfx-helper';
import {filter, Observable, switchMap} from 'rxjs';

import {GetOrderResponse} from '../../_shared/waiterrobot-backend';
import {EventsService} from '../events/_services/events.service';

@Injectable({providedIn: 'root'})
export class OrdersService implements HasGetAll<GetOrderResponse> {
  url = '/config/order';

  constructor(private httpClient: HttpClient, private eventsService: EventsService) {}

  getAll$(): Observable<GetOrderResponse[]> {
    return this.eventsService.getSelected$.pipe(
      filter(notNullAndUndefined),
      switchMap((event) => this.httpClient.get<GetOrderResponse[]>(this.url, {params: new HttpParams().set('eventId', event.id)}))
    );
  }
}
