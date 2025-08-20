import {Injectable, inject} from '@angular/core';

import {BehaviorSubject, combineLatest, switchMap, tap} from 'rxjs';

import {APIType, injectAPI} from '../api';
import {HasCreateWithIdResponse, HasUpdateWithIdResponse} from '../util/custom-types';
import {SelectedEventService} from './selected-event.service';

@Injectable({providedIn: 'root'})
export class UnpaidReasonsService
  implements HasCreateWithIdResponse<APIType['CreateBillUnpaidReasonDto']>, HasUpdateWithIdResponse<APIType['UpdateBillUnpaidReasonDto']>
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

  create$(body: APIType['CreateBillUnpaidReasonDto']) {
    return this.#api.post('/v1/config/billing/unpaid', {body}).pipe(
      tap(() => {
        this.triggerRefresh.next(true);
      }),
    );
  }

  update$(body: APIType['UpdateBillUnpaidReasonDto']) {
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
