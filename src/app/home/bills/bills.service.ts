import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {BehaviorSubject, filter, Observable, switchMap} from 'rxjs';

import {notNullAndUndefined} from 'dfts-helper';
import {HasGetSingle} from 'dfx-helper';

import {GetPaginatedFn, getPaginationParams, PageableDto} from '../../_shared/services/services.interface';
import {GetBillMinResponse, GetBillResponse, PaginatedResponseGetBillMinResponse} from '../../_shared/waiterrobot-backend';
import {EventsService} from '../events/_services/events.service';

@Injectable({providedIn: 'root'})
export class BillsService implements HasGetSingle<GetBillResponse> {
  url = '/config/billing';

  constructor(
    private httpClient: HttpClient,
    private eventsService: EventsService,
  ) {}

  public triggerRefresh = new BehaviorSubject<boolean>(true);

  getSingle$(id: GetBillResponse['id']): Observable<GetBillResponse> {
    return this.triggerRefresh.pipe(switchMap(() => this.httpClient.get<GetBillResponse>(`${this.url}/${id}`)));
  }

  getAllPaginatedFn(): GetPaginatedFn<GetBillMinResponse> {
    return (options: PageableDto) =>
      this.triggerRefresh.pipe(
        switchMap(() => this.eventsService.getSelected$),
        filter(notNullAndUndefined),
        switchMap((event) =>
          this.httpClient.get<PaginatedResponseGetBillMinResponse>(`${this.url}`, {
            params: getPaginationParams(options).append('eventId', event.id),
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
