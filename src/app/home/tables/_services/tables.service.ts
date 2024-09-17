import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';

import {HasCreateWithIdResponse, HasUpdateWithIdResponse} from '@shared/services/services.interface';
import {
  CreateTableDto,
  GetTableGroupResponse,
  GetTableIdsWithActiveOrdersResponse,
  GetTableWithGroupMinResponse,
  GetTableWithGroupResponse,
  IdResponse,
  UpdateTableDto,
} from '@shared/waiterrobot-backend';

import {s_from} from 'dfts-helper';
import {HasDelete, HasGetAll, HasGetByParent, HasGetSingle} from 'dfx-helper';

import {BehaviorSubject, combineLatest, map, Observable, switchMap, tap} from 'rxjs';

import {SelectedEventService} from '../../_admin/events/_services/selected-event.service';

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

  #isNextTableMissing(table: GetTableWithGroupResponse, index: number, tables: GetTableWithGroupResponse[]): boolean {
    const nextTable = tables.at(index + 1);
    return !!nextTable && table.group.id === nextTable.group.id && table.number + 1 !== nextTable.number;
  }

  #sortByGroupPositionAndNumber(a: GetTableWithGroupResponse, b: GetTableWithGroupMinResponse) {
    // Default to a high value if position is undefined
    const positionA = a.group.position ?? 100000;
    const positionB = b.group.position ?? 100000;

    // First compare by group position
    if (positionA !== positionB) {
      return positionA - positionB;
    }

    // If positions are the same or undefined, compare by group name
    const nameA = a.group.name;
    const nameB = b.group.name;

    const nameCompare = nameA.localeCompare(nameB);
    if (nameCompare !== 0) {
      return nameCompare;
    }

    // If group names are the same, compare by number
    return a.number - b.number;
  }

  getAll$(): Observable<GetTableWithGroupResponse[]> {
    return combineLatest([this.selectedEventService.selectedIdNotNull$, this.triggerGet$]).pipe(
      switchMap(([eventId]) =>
        combineLatest([
          this.httpClient.get<GetTableWithGroupResponse[]>(this.url, {params: {eventId}}),
          this.getTableIdsWithActiveOrders$(eventId),
        ]),
      ),
      map(([tables, tableIdsWithActiveOrders]) =>
        tables.sort(this.#sortByGroupPositionAndNumber).map((table, index) => ({
          ...table,
          hasActiveOrders: tableIdsWithActiveOrders.tableIds.includes(table.id),
          missingNextTable: this.#isNextTableMissing(table, index, tables),
        })),
      ),
    );
  }

  getAllWithoutExtra$(): Observable<GetTableWithGroupResponse[]> {
    return combineLatest([this.selectedEventService.selectedIdNotNull$, this.triggerGet$]).pipe(
      switchMap(([eventId]) => this.httpClient.get<GetTableWithGroupResponse[]>(this.url, {params: {eventId}})),
    );
  }

  getByParent$(groupId: number): Observable<GetTableWithGroupResponse[]> {
    return combineLatest([this.selectedEventService.selectedIdNotNull$, this.triggerGet$]).pipe(
      switchMap(([eventId]) =>
        combineLatest([
          this.httpClient.get<GetTableWithGroupResponse[]>(this.url, {params: {groupId}}),
          this.getTableIdsWithActiveOrders$(eventId),
        ]),
      ),
      map(([tables, tableIdsWithActiveOrders]) =>
        tables
          .sort((a, b) => a.number - b.number)
          .map((table, index) => ({
            ...table,
            hasActiveOrders: tableIdsWithActiveOrders.tableIds.includes(table.id),
            missingNextTable: this.#isNextTableMissing(table, index, tables),
          })),
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

  unDelete$(id: number): Observable<unknown> {
    return this.httpClient.delete(`${this.url}/${s_from(id)}/undo`);
  }

  checkIfExists(groupId: number, tableNumber: number): Observable<boolean> {
    return this.httpClient.get<boolean>('/config/table/existsByGroupIdAndNumber', {params: {groupId, tableNumber}});
  }
}
