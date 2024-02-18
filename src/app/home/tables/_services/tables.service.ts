import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';

import {BehaviorSubject, combineLatest, map, Observable, switchMap, tap} from 'rxjs';

import {HasCreateWithIdResponse, HasUpdateWithIdResponse} from '@shared/services/services.interface';
import {
  CreateTableDto,
  GetTableGroupResponse,
  GetTableIdsWithActiveOrdersResponse,
  GetTableWithGroupResponse,
  IdResponse,
  UpdateTableDto,
} from '@shared/waiterrobot-backend';

import {s_from} from 'dfts-helper';
import {HasDelete, HasGetAll, HasGetByParent, HasGetSingle} from 'dfx-helper';

import {SelectedEventService} from '../../events/_services/selected-event.service';

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

  private httpClient = inject(HttpClient);
  private selectedEventService = inject(SelectedEventService);

  triggerGet$ = new BehaviorSubject(true);

  getAll$(): Observable<GetTableWithGroupResponse[]> {
    return this.triggerGet$.pipe(
      switchMap(() => this.selectedEventService.selectedIdNotNull$),
      switchMap((eventId) =>
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
      switchMap(() => this.selectedEventService.selectedIdNotNull$),
      switchMap((eventId) =>
        combineLatest([
          this.httpClient.get<GetTableWithGroupResponse[]>(this.url, {params: {groupId}}),
          this.getTableIdsWithActiveOrders$(eventId),
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
    return this.httpClient.post<IdResponse>(this.url, dto).pipe(
      tap(() => {
        this.triggerGet$.next(true);
      }),
    );
  }

  update$(dto: UpdateTableDto): Observable<IdResponse> {
    return this.httpClient.put<IdResponse>(this.url, dto).pipe(
      tap(() => {
        this.triggerGet$.next(true);
      }),
    );
  }

  delete$(id: number): Observable<unknown> {
    return this.httpClient.delete(`${this.url}/${s_from(id)}`).pipe(
      tap(() => {
        this.triggerGet$.next(true);
      }),
    );
  }

  checkIfExists(groupId: number, tableNumber: number): Observable<boolean> {
    return this.httpClient.get<boolean>('/config/table/existsByGroupIdAndNumber', {params: {groupId, tableNumber}});
  }
}
