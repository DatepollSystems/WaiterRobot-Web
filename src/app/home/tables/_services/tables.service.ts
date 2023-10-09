import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {BehaviorSubject, combineLatest, map, Observable, switchMap, tap} from 'rxjs';

import {s_from} from 'dfts-helper';
import {HasDelete, HasGetAll, HasGetByParent, HasGetSingle} from 'dfx-helper';

import {HasCreateWithIdResponse, HasUpdateWithIdResponse} from '../../../_shared/services/services.interface';
import {
  CreateTableDto,
  GetTableGroupResponse,
  GetTableIdsWithActiveOrdersResponse,
  GetTableWithGroupResponse,
  IdResponse,
  UpdateTableDto,
} from '../../../_shared/waiterrobot-backend';
import {EventsService} from '../../events/_services/events.service';

@Injectable({providedIn: 'root'})
export class TablesService
  implements
    HasGetAll<GetTableWithGroupResponse>,
    HasGetSingle<GetTableWithGroupResponse>,
    HasCreateWithIdResponse<CreateTableDto>,
    HasUpdateWithIdResponse<UpdateTableDto>,
    HasGetByParent<GetTableWithGroupResponse, GetTableGroupResponse>,
    HasDelete<GetTableWithGroupResponse>
{
  url = '/config/table';

  constructor(
    private httpClient: HttpClient,
    private eventsService: EventsService,
  ) {}

  triggerGet$ = new BehaviorSubject(true);

  getAll$(): Observable<GetTableWithGroupResponse[]> {
    return this.triggerGet$.pipe(
      switchMap(() => this.eventsService.getSelectedNotNull$),
      switchMap(({id: eventId}) =>
        combineLatest([
          this.httpClient.get<GetTableWithGroupResponse[]>(this.url, {params: {eventId}}),
          this.getTableIdsWithActiveOrders$(eventId),
        ]),
      ),
      map(([tables, tableIdsWithActiveOrders]) =>
        tables.map((table) => ({...table, hasActiveOrders: tableIdsWithActiveOrders.tableIds.includes(table.id)})),
      ),
    );
  }

  getByParent$(groupId: number): Observable<GetTableWithGroupResponse[]> {
    return this.triggerGet$.pipe(
      switchMap(() => this.eventsService.getSelectedNotNull$),
      switchMap(({id}) =>
        combineLatest([
          this.httpClient.get<GetTableWithGroupResponse[]>(this.url, {params: {groupId}}),
          this.getTableIdsWithActiveOrders$(id),
        ]),
      ),
      map(([tables, tableIdsWithActiveOrders]) =>
        tables.map((table) => ({...table, hasActiveOrders: tableIdsWithActiveOrders.tableIds.includes(table.id)})),
      ),
    );
  }

  private getTableIdsWithActiveOrders$(eventId: number): Observable<GetTableIdsWithActiveOrdersResponse> {
    return this.httpClient.get<GetTableIdsWithActiveOrdersResponse>(`${this.url}/activeOrders`, {params: {eventId}});
  }

  getSingle$(id: number): Observable<GetTableWithGroupResponse> {
    return this.httpClient.get<GetTableWithGroupResponse>(`${this.url}/${s_from(id)}`);
  }

  create$(dto: CreateTableDto): Observable<IdResponse> {
    return this.httpClient.post<IdResponse>(this.url, dto).pipe(tap(() => this.triggerGet$.next(true)));
  }

  update$(dto: UpdateTableDto): Observable<IdResponse> {
    return this.httpClient.put<IdResponse>(this.url, dto).pipe(tap(() => this.triggerGet$.next(true)));
  }

  delete$(id: number): Observable<unknown> {
    return this.httpClient.delete(`${this.url}/${s_from(id)}`).pipe(tap(() => this.triggerGet$.next(true)));
  }

  checkIfExists(groupId: number, tableNumber: number): Observable<boolean> {
    return this.httpClient.get<boolean>('/config/table/existsByGroupIdAndNumber', {params: {groupId, tableNumber}});
  }
}
