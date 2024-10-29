import {Injectable, inject} from '@angular/core';

import {BehaviorSubject, Observable, combineLatest, map, switchMap, tap} from 'rxjs';

import {BackendType, injectAPI} from '@shared/api';
import {HasCreateWithIdResponse, HasUpdateWithIdResponse} from '@shared/services/custom-types';
import {SelectedEventService} from '@shared/services/selected-event.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService
  implements HasCreateWithIdResponse<BackendType['CreateProductDto']>, HasUpdateWithIdResponse<BackendType['UpdateProductDto']>
{
  #api = injectAPI();
  #selectedEventService = inject(SelectedEventService);

  triggerGet$ = new BehaviorSubject(true);

  #sortByPositionAndName(a: BackendType['GetProductMaxResponse'], b: BackendType['GetProductMaxResponse']) {
    // Default to a high value if position is undefined
    const groupPositionA = a.group.position ?? 100000;
    const groupPositionB = b.group.position ?? 100000;

    // First compare by group position
    if (groupPositionA !== groupPositionB) {
      return groupPositionA - groupPositionB;
    }

    // If positions are the same or undefined, compare by group name
    const groupNameCompare = a.group.name.toLocaleLowerCase().localeCompare(b.group.name.toLocaleLowerCase());
    if (groupNameCompare !== 0) {
      return groupNameCompare;
    }

    // If group names are the same, compare by product position
    // Default to a high value if position is undefined
    const positionA = a.position ?? 100000;
    const positionB = b.position ?? 100000;

    // First compare by product position
    if (positionA !== positionB) {
      return positionA - positionB;
    }

    // If positions are the same or undefined, compare by product name
    return a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase());
  }

  getAll$() {
    return combineLatest([this.#selectedEventService.selectedIdNotNull$, this.triggerGet$]).pipe(
      switchMap(([eventId]) =>
        this.#api.get('/v1/config/product', {
          params: {
            query: {
              eventId,
            },
          },
        }),
      ),
      map((products) => products.sort(this.#sortByPositionAndName)),
    );
  }

  getByParent$(groupId: number) {
    return this.triggerGet$.pipe(
      switchMap(() =>
        this.#api.get('/v1/config/product', {
          params: {
            query: {
              groupId,
            },
          },
        }),
      ),
      map((products) => products.sort(this.#sortByPositionAndName)),
    );
  }

  getSingle$(id: number) {
    return this.#api.get('/v1/config/product/{id}', {
      params: {
        path: {
          id,
        },
      },
    });
  }

  create$(body: BackendType['CreateProductDto']) {
    return this.#api.post('/v1/config/product', {body}).pipe(
      tap(() => {
        this.triggerGet$.next(true);
      }),
    );
  }

  update$(body: BackendType['UpdateProductDto']) {
    return this.#api
      .put('/v1/config/product', {
        body,
      })
      .pipe(
        tap(() => {
          this.triggerGet$.next(true);
        }),
      );
  }

  toggleSoldOut$(dto: BackendType['GetProductMaxResponse'], soldOut?: boolean) {
    return this.#api
      .put('/v1/config/product', {
        body: {
          ...dto,
          soldOut: soldOut ?? !dto.soldOut,
          allergenIds: dto.allergens.map((it) => it.id),
          groupId: dto.group.id,
          printerId: dto.printer.id,
          resetOrderedProducts: false,
        },
      })
      .pipe(
        tap(() => {
          this.triggerGet$.next(true);
        }),
      );
  }

  delete$(id: number) {
    return this.#api.delete('/v1/config/product/{id}', {
      params: {
        path: {id},
      },
    });
  }

  unDelete$(id: number): Observable<unknown> {
    return this.#api.delete('/v1/config/product/{id}/undo', {
      params: {
        path: {id},
      },
    });
  }

  order$(groupId: number, body: BackendType['EntityOrderDto'][]) {
    return this.#api
      .patch('/v1/config/product/order', {
        body,
        params: {
          query: {
            groupId,
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
