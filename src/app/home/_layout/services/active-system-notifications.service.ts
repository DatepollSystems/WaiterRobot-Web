import {Injectable, computed, signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';

import {BehaviorSubject, EMPTY, catchError, switchMap} from 'rxjs';

import {s_fromStorage, st_remove, st_set} from 'dfts-helper';

import {injectAPI} from '@shared/api';

@Injectable({providedIn: 'root'})
export class ActiveSystemNotificationsService {
  #storageKey = 'ignoredSystemNotifications';
  #api = injectAPI();

  triggerGet$ = new BehaviorSubject(true);

  allSystemNotifications = toSignal(
    this.triggerGet$.pipe(
      switchMap(() => this.#api.get('/v1/system-notification')),
      catchError(() => EMPTY),
    ),
    {initialValue: []},
  );
  ignoredSystemNotifications = signal(JSON.parse(s_fromStorage(this.#storageKey) ?? '[]') as number[]);

  getFilteredSystemNotifications = computed(() =>
    this.allSystemNotifications().filter((it) => !this.ignoredSystemNotifications().includes(it.id)),
  );

  ignore(id: number): void {
    this.ignoredSystemNotifications.update((it) => {
      it.push(id);

      return it;
    });
    st_set(this.#storageKey, JSON.stringify(this.ignoredSystemNotifications()), 60 * 60 * 24 * 14);
  }

  ignoreAll(): void {
    this.ignoredSystemNotifications.set(this.allSystemNotifications().map((it) => it.id));
    st_set(this.#storageKey, JSON.stringify(this.ignoredSystemNotifications()), 60 * 60 * 24 * 14);
  }

  resetIgnore(): void {
    st_remove(this.#storageKey);
    this.ignoredSystemNotifications.set([]);
  }
}
