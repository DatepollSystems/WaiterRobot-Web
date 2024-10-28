import {Injectable, inject} from '@angular/core';

import {BehaviorSubject, Observable, combineLatest, switchMap, take} from 'rxjs';

import {n_generate_int} from 'dfts-helper';

import {Download, DownloadService} from '@home-shared/services/download.service';

import {injectAPI} from '@shared/api';
import {PageableDto} from '@shared/api/pagination';
import {SelectedEventService} from '@shared/services/selected-event.service';

@Injectable({providedIn: 'root'})
export class BillsService {
  #api = injectAPI();
  #downloadService = inject(DownloadService);
  #selectedEventService = inject(SelectedEventService);

  triggerRefresh = new BehaviorSubject<boolean>(true);

  getSingle$(id: number) {
    return this.triggerRefresh.pipe(
      switchMap(() =>
        this.#api.get('/v1/config/billing/{id}', {
          params: {
            path: {id},
          },
        }),
      ),
    );
  }

  getAllPaginated(
    options: PageableDto,
    tableIds?: number[],
    tableGroupIds?: number[],
    productIds?: number[],
    productGroupIds?: number[],
    waiterIds?: number[],
    unpaidReasonId?: number,
  ) {
    return combineLatest([this.#selectedEventService.selectedIdNotNull$, this.triggerRefresh]).pipe(
      switchMap(([eventId]) =>
        this.#api.get('/v1/config/billing', {
          params: {
            query: {
              eventId,
              ...options,
              tableIds,
              tableGroupIds,
              productIds,
              productGroupIds,
              waiterIds,
              unpaidReasonId,
            },
          },
        }),
      ),
    );
  }

  download$(): Observable<Download> {
    return this.#selectedEventService.selectedIdNotNull$.pipe(
      take(1),
      switchMap((eventId) =>
        this.#downloadService.download$(`/v1/config/billing/export/${eventId}`, `bills_export_${n_generate_int(100, 9999)}.csv`),
      ),
    );
  }
}
