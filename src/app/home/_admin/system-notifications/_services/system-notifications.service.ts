import {Injectable, inject} from '@angular/core';

import {BehaviorSubject, map, shareReplay, switchMap, tap} from 'rxjs';

import {HasGetSingle} from 'dfx-helper';

import {BackendType, injectAPI} from '@shared/api';
import {HasCreateWithIdResponse, HasUpdateWithIdResponse} from '@shared/services/services.interface';

import {ActiveSystemNotificationsService} from '../../../_layout/services/active-system-notifications.service';

@Injectable({providedIn: 'root'})
export class SystemNotificationsService
  implements
    HasGetSingle<BackendType['GetSystemNotificationResponse']>,
    HasCreateWithIdResponse<BackendType['CreateSystemNotificationDto']>,
    HasUpdateWithIdResponse<BackendType['UpdateSystemNotificationDto']>
{
  #api = injectAPI();
  #activeSystemNotificationsService = inject(ActiveSystemNotificationsService);

  triggerGet$ = new BehaviorSubject(true);

  getAll$() {
    return this.triggerGet$.pipe(
      switchMap(() => this.#api.get('/v1/system-notification/all')),
      shareReplay(1),
    );
  }

  getSingle$(id: number) {
    return this.getAll$().pipe(map((notifications) => notifications.find((it) => it.id === id)!));
  }

  create$(body: BackendType['CreateSystemNotificationDto']) {
    return this.#api.post('/v1/system-notification', {body}).pipe(
      tap(() => {
        this.triggerGet$.next(true);
        this.#activeSystemNotificationsService.triggerGet$.next(true);
      }),
    );
  }

  update$(body: BackendType['UpdateSystemNotificationDto']) {
    return this.#api.put('/v1/system-notification', {body}).pipe(
      tap(() => {
        this.triggerGet$.next(true);
        this.#activeSystemNotificationsService.triggerGet$.next(true);
      }),
    );
  }

  delete$(id: number) {
    return this.#api
      .delete('/v1/system-notification/{id}', {
        params: {
          path: {id},
        },
      })
      .pipe(
        tap(() => {
          this.triggerGet$.next(true);
          this.#activeSystemNotificationsService.triggerGet$.next(true);
        }),
      );
  }
}

export const systemNotificationTypes = ['INFO', 'WARNING', 'DANGER', 'SUCCESS', 'NEUTRAL'];
