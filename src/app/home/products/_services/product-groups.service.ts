import {Injectable, inject} from '@angular/core';

import {BehaviorSubject, combineLatest, map, switchMap, tap} from 'rxjs';

import {APIType, PageableDto, injectAPI} from '../../../api';
import {SelectedEventService} from '../../../services/selected-event.service';
import {HasCreateWithIdResponse, HasOrdered, HasUpdateWithIdResponse} from '../../../util/custom-types';

@Injectable({providedIn: 'root'})
export class ProductGroupsService
  implements
    HasCreateWithIdResponse<APIType['CreateProductGroupDto']>,
    HasUpdateWithIdResponse<APIType['UpdateProductGroupDto']>,
    HasOrdered<APIType['GetProductGroupResponse']>
{
  #api = injectAPI();
  #selectedEventService = inject(SelectedEventService);

  triggerGet$ = new BehaviorSubject(true);

  #sortByPositionAndName(a: APIType['GetProductGroupResponse'], b: APIType['GetProductGroupResponse']) {
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
        this.#api.get('/v1/config/product/group', {
          params: {
            query: {
              eventId,
            },
          },
        }),
      ),
      map((it) => it.sort(this.#sortByPositionAndName)),
    );
  }

  getSingle$(id: number) {
    return this.#api.get('/v1/config/product/group/{id}', {
      params: {
        path: {
          id,
        },
      },
    });
  }

  create$(body: APIType['CreateProductGroupDto']) {
    return this.#api
      .post('/v1/config/product/group', {
        body,
      })
      .pipe(
        tap(() => {
          this.triggerGet$.next(true);
        }),
      );
  }

  update$(body: APIType['UpdateProductGroupDto']) {
    return this.#api
      .put('/v1/config/product/group', {
        body,
      })
      .pipe(
        tap(() => {
          this.triggerGet$.next(true);
        }),
      );
  }

  delete$(id: number) {
    return this.#api.delete('/v1/config/product/group/{id}', {
      params: {
        path: {id},
      },
    });
  }

  unDelete$(id: number) {
    return this.#api.delete('/v1/config/product/group/{id}/undo', {
      params: {
        path: {id},
      },
    });
  }

  getAllDeleted$(options: PageableDto) {
    return combineLatest([this.#selectedEventService.selectedIdNotNull$, this.triggerGet$]).pipe(
      switchMap(([eventId]) =>
        this.#api.get('/v1/config/product/group/deleted', {
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
      .patch('/v1/config/product/group/order', {
        body,
        params: {
          query: {
            eventId: this.#selectedEventService.selectedId() ?? -1,
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
