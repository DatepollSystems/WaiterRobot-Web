import {Injectable, inject} from '@angular/core';

import {BehaviorSubject, Observable, map, switchMap, take, tap, timer} from 'rxjs';

import {n_generate_int} from 'dfts-helper';

import {DownloadService} from '@home-shared/services/download.service';

import {PageableDto, injectAPI} from '@shared/api';
import {NotificationService} from '@shared/notifications/notification.service';
import {SelectedEventService} from '@shared/services/selected-event.service';

@Injectable({providedIn: 'root'})
export class OrdersService {
  #api = injectAPI();
  #selectedEventService = inject(SelectedEventService);
  #downloadService = inject(DownloadService);
  #notificationService = inject(NotificationService);

  private readonly refreshIn = 30;

  triggerRefresh = new BehaviorSubject<boolean>(true);

  countdown$ = (): Observable<number> =>
    this.triggerRefresh.pipe(
      switchMap(() => timer(0, 1000)),
      map((tick) => this.refreshIn - (tick % this.refreshIn)),
    );

  getSingle$(id: number) {
    return this.triggerRefresh.pipe(
      switchMap(() => timer(0, this.refreshIn * 1000)),
      switchMap(() =>
        this.#api.get('/v1/config/order/{id}', {
          params: {
            path: {
              id,
            },
          },
        }),
      ),
      tap(() => {
        this.#notificationService.tsuccess('HOME_ORDER_REFRESHED');
      }),
    );
  }

  download$() {
    return this.#selectedEventService.selectedIdNotNull$.pipe(
      take(1),
      switchMap((eventId) =>
        this.#downloadService.download$(`/v1/config/order/export/${eventId}`, `orders_export_${n_generate_int(100, 9999)}.csv`),
      ),
    );
  }

  printAllTest(): void {
    this.#selectedEventService.selectedIdNotNull$
      .pipe(
        take(1),
        switchMap((eventId) =>
          this.#api.post(`/v1/config/order/test/all`, {
            params: {
              query: {eventId},
            },
          }),
        ),
        tap(() => {
          this.triggerRefresh.next(true);
        }),
      )
      .subscribe(() => {
        this.#notificationService.tsuccess('SENT');
      });
  }

  requeueOrder$(id: number) {
    return this.#api
      .get('/v1/config/order/{id}/requeue', {
        params: {
          path: {id},
        },
      })
      .pipe(
        tap(() => {
          this.triggerRefresh.next(true);
        }),
      );
  }

  requeueOrderPrinter$(id: number, printerId: number) {
    return this.#api
      .get('/v1/config/order/{id}/requeue/{printerId}', {
        params: {
          path: {
            id,
            printerId,
          },
        },
      })
      .pipe(
        tap(() => {
          this.triggerRefresh.next(true);
        }),
      );
  }

  getAllPaginated(
    options: PageableDto,
    tableIds?: number[],
    tableGroupIds?: number[],
    productIds?: number[],
    productGroupIds?: number[],
    waiterIds?: number[],
  ) {
    return this.triggerRefresh.pipe(
      switchMap(() => this.#selectedEventService.selectedIdNotNull$),
      switchMap((eventId) =>
        this.#api.get('/v1/config/order', {
          params: {
            query: {
              eventId,
              ...options,
              tableIds,
              tableGroupIds,
              productIds,
              productGroupIds,
              waiterIds,
            },
          },
        }),
      ),
    );
  }
}
