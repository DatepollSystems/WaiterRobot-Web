import {Injectable} from '@angular/core';

import {BehaviorSubject, switchMap, tap} from 'rxjs';

import {APIType, injectAPI} from '../../../api';
import {HasCreateWithIdResponse, HasUpdateWithIdResponse} from '../../../util/custom-types';

@Injectable({providedIn: 'root'})
export class WaitersService
  implements HasCreateWithIdResponse<APIType['CreateWaiterDto']>, HasUpdateWithIdResponse<APIType['UpdateWaiterDto']>
{
  #api = injectAPI();

  triggerGet$ = new BehaviorSubject(true);

  getSingle$(id: number) {
    return this.#api.get('/v1/config/waiter/{id}', {
      params: {
        path: {id},
      },
    });
  }

  getByParent$(eventId: number) {
    return this.triggerGet$.pipe(
      switchMap(() =>
        this.#api.get('/v1/config/waiter', {
          params: {
            query: {
              eventId,
            },
          },
        }),
      ),
    );
  }

  create$(body: APIType['CreateWaiterDto']) {
    return this.#api
      .post('/v1/config/waiter', {
        body,
      })
      .pipe(
        tap(() => {
          this.triggerGet$.next(true);
        }),
      );
  }

  update$(body: APIType['UpdateWaiterDto']) {
    return this.#api
      .put('/v1/config/waiter', {
        body,
      })
      .pipe(
        tap(() => {
          this.triggerGet$.next(true);
        }),
      );
  }

  toggleActivated$(dto: APIType['GetWaiterResponse'], activated?: boolean) {
    return this.#api
      .put('/v1/config/waiter', {
        body: {
          ...dto,
          activated: activated ?? !dto.activated,
          eventIds: dto.events.map((it) => it.id),
        },
      })
      .pipe(
        tap(() => {
          this.triggerGet$.next(true);
        }),
      );
  }

  delete$(id: number) {
    return this.#api
      .delete('/v1/config/waiter/{id}', {
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
}
