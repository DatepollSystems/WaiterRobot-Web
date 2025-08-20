import {Injectable, inject} from '@angular/core';

import {BehaviorSubject, Observable, combineLatest, map, switchMap, tap} from 'rxjs';

import {APIType, PageableDto, injectAPI} from '@shared/api';
import {HasCreateWithIdResponse, HasOrdered, HasUpdateWithIdResponse} from '@shared/services/custom-types';
import {SelectedEventService} from '@shared/services/selected-event.service';

@Injectable({providedIn: 'root'})
export class TableGroupsService
  implements
    HasCreateWithIdResponse<APIType['CreateTableGroupDto']>,
    HasUpdateWithIdResponse<APIType['UpdateTableGroupDto']>,
    HasOrdered<APIType['GetTableGroupResponse']>
{
  #api = injectAPI();
  #selectedEventService = inject(SelectedEventService);

  triggerGet$ = new BehaviorSubject(true);

  #sortByPositionAndName(a: APIType['GetTableGroupResponse'], b: APIType['GetTableGroupResponse']) {
    // Default to a high value if position is undefined
    const groupPositionA = a.position ?? 100000;
    const groupPositionB = b.position ?? 100000;

    // First compare by position
    if (groupPositionA !== groupPositionB) {
      return groupPositionA - groupPositionB;
    }

    // If positions are the same or undefined, compare by name
    const groupNameCompare = a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase());
    return groupNameCompare;
  }

  getAll$() {
    return combineLatest([this.#selectedEventService.selectedIdNotNull$, this.triggerGet$]).pipe(
      switchMap(([eventId]) =>
        this.#api.get('/v1/config/table/group', {
          params: {
            query: {eventId},
          },
        }),
      ),
      map((it) => it.sort(this.#sortByPositionAndName)),
    );
  }

  getSingle$(id: number) {
    return this.#api.get('/v1/config/table/group/{id}', {
      params: {
        path: {id},
      },
    });
  }

  create$(body: APIType['CreateTableGroupDto']) {
    return this.#api
      .post('/v1/config/table/group', {
        body,
      })
      .pipe(
        tap(() => {
          this.triggerGet$.next(true);
        }),
      );
  }

  update$(body: APIType['UpdateTableGroupDto']) {
    return this.#api
      .put('/v1/config/table/group', {
        body,
      })
      .pipe(
        tap(() => {
          this.triggerGet$.next(true);
        }),
      );
  }

  delete$(id: number) {
    return this.#api
      .delete('/v1/config/table/group/{id}', {
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
    return this.#api.delete('/v1/config/table/group/{id}/undo', {
      params: {
        path: {id},
      },
    });
  }

  getAllDeleted$(options: PageableDto) {
    return combineLatest([this.#selectedEventService.selectedIdNotNull$, this.triggerGet$]).pipe(
      switchMap(([eventId]) =>
        this.#api.get('/v1/config/table/group/deleted', {
          params: {
            query: {
              eventId,
              ...options,
            },
          },
        }),
      ),
    );
  }

  order$(body: APIType['EntityOrderDto'][]) {
    return this.#api
      .patch('/v1/config/table/group/order', {
        body,
        params: {
          query: {
            eventId: this.#selectedEventService.selectedId()!,
          },
        },
      })
      .pipe(
        tap(() => {
          this.triggerGet$.next(true);
        }),
      );
  }
}
