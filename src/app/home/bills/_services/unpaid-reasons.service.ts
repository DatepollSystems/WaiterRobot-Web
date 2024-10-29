import {Injectable, inject} from '@angular/core';

import {BehaviorSubject, combineLatest, switchMap, tap} from 'rxjs';

import {BackendType, injectAPI} from '@shared/api';
import {HasCreateWithIdResponse, HasUpdateWithIdResponse} from '@shared/services/custom-types';
import {SelectedEventService} from '@shared/services/selected-event.service';

@Injectable({providedIn: 'root'})
export class UnpaidReasonsService
  implements
    HasCreateWithIdResponse<BackendType['CreateBillUnpaidReasonDto']>,
    HasUpdateWithIdResponse<BackendType['UpdateBillUnpaidReasonDto']>
{
  #api = injectAPI();
  #selectedEventService = inject(SelectedEventService);

  triggerRefresh = new BehaviorSubject<boolean>(true);

  getSingle$(id: number) {
    return this.triggerRefresh.pipe(switchMap(() => this.#api.get('/v1/config/billing/unpaid/{id}', {params: {path: {id}}})));
  }

  getAll$() {
    return combineLatest([this.#selectedEventService.selectedIdNotNull$, this.triggerRefresh]).pipe(
      switchMap(([eventId]) =>
        this.#api.get('/v1/config/billing/unpaid', {
          params: {query: {eventId}},
        }),
      ),
    );
  }

  create$(body: BackendType['CreateBillUnpaidReasonDto']) {
    return this.#api.post('/v1/config/billing/unpaid', {body}).pipe(
      tap(() => {
        this.triggerRefresh.next(true);
      }),
    );
  }

  update$(body: BackendType['UpdateBillUnpaidReasonDto']) {
    return this.#api.put('/v1/config/billing/unpaid', {body}).pipe(
      tap(() => {
        this.triggerRefresh.next(true);
      }),
    );
  }

  delete$(id: number) {
    return this.#api
      .delete('/v1/config/billing/unpaid/{id}', {
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
}
