import {Injectable, inject} from '@angular/core';

import {BehaviorSubject, Observable, combineLatest, map, switchMap, tap} from 'rxjs';

import {APIType, injectAPI} from '@shared/api';
import {HasCreateWithIdResponse, HasUpdateWithIdResponse} from '@shared/services/custom-types';
import {SelectedEventService} from '@shared/services/selected-event.service';

@Injectable({providedIn: 'root'})
export class TablesService
  implements HasCreateWithIdResponse<APIType['CreateTableDto']>, HasUpdateWithIdResponse<APIType['UpdateTableDto']>
{
  #api = injectAPI();
  #selectedEventService = inject(SelectedEventService);

  triggerGet$ = new BehaviorSubject(true);

  #isNextTableMissing(table: APIType['GetTableWithGroupResponse'], index: number, tables: APIType['GetTableWithGroupResponse'][]): boolean {
    const nextTable = tables.at(index + 1);
    return !!nextTable && table.group.id === nextTable.group.id && table.number + 1 !== nextTable.number;
  }

  #sortByGroupPositionAndNumber(a: APIType['GetTableWithGroupResponse'], b: APIType['GetTableWithGroupMinResponse']) {
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

  getAll$() {
    return combineLatest([this.#selectedEventService.selectedIdNotNull$, this.triggerGet$]).pipe(
      switchMap(([eventId]) =>
        combineLatest([
          this.#api.get('/v1/config/table', {
            params: {
              query: {eventId},
            },
          }),
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

  getAllWithoutExtra$() {
    return combineLatest([this.#selectedEventService.selectedIdNotNull$, this.triggerGet$]).pipe(
      switchMap(([eventId]) =>
        this.#api.get('/v1/config/table', {
          params: {
            query: {eventId},
          },
        }),
      ),
    );
  }

  getByParent$(groupId: number) {
    return combineLatest([this.#selectedEventService.selectedIdNotNull$, this.triggerGet$]).pipe(
      switchMap(([eventId]) =>
        combineLatest([
          this.#api.get('/v1/config/table', {
            params: {
              query: {groupId},
            },
          }),
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

  private getTableIdsWithActiveOrders$(eventId: number) {
    return this.#api.get('/v1/config/table/activeOrders', {
      params: {
        query: {eventId},
      },
    });
  }

  getSingle$(id: number) {
    return this.#api.get('/v1/config/table/{id}', {
      params: {
        path: {id},
      },
    });
  }

  create$(body: APIType['CreateTableDto']) {
    return this.#api
      .post('/v1/config/table', {
        body,
      })
      .pipe(
        tap(() => {
          this.triggerGet$.next(true);
        }),
      );
  }

  update$(body: APIType['UpdateTableDto']) {
    return this.#api.put('/v1/config/table', {body}).pipe(
      tap(() => {
        this.triggerGet$.next(true);
      }),
    );
  }

  delete$(id: number) {
    return this.#api
      .delete('/v1/config/table/{id}', {
        params: {
          path: {id},
        },
      })
      .pipe(
        tap(() => {
          this.triggerGet$.next(true);
        }),
      );
  }

  unDelete$(id: number): Observable<unknown> {
    return this.#api.delete('/v1/config/table/{id}/undo', {
      params: {
        path: {
          id,
        },
      },
    });
  }

  checkIfExists(groupId: number, tableNumber: number): Observable<boolean> {
    return this.#api.get('/v1/config/table/existsByGroupIdAndNumber', {
      params: {
        query: {groupId, tableNumber},
      },
    });
  }
}
