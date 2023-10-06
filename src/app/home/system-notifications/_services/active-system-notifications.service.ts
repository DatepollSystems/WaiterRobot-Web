import {HttpClient} from '@angular/common/http';
import {computed, Injectable, signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';

import {BehaviorSubject, switchMap} from 'rxjs';

import {s_fromStorage, st_remove, st_set} from 'dfts-helper';

import {GetSystemNotificationResponse} from '../../../_shared/waiterrobot-backend';

@Injectable({providedIn: 'root'})
export class ActiveSystemNotificationsService {
  url = '/system-notification';
  storageKey = 'ignoredSystemNotifications';

  constructor(private httpClient: HttpClient) {}

  triggerGet$ = new BehaviorSubject(true);

  allSystemNotifications = toSignal(
    this.triggerGet$.pipe(switchMap(() => this.httpClient.get<GetSystemNotificationResponse[]>(this.url))),
    {initialValue: []},
  );
  ignoredSystemNotifications = signal((JSON.parse(s_fromStorage(this.storageKey) ?? '[]') as number[]) ?? []);

  getFilteredSystemNotifications = computed(() =>
    this.allSystemNotifications().filter((it) => !this.ignoredSystemNotifications().includes(it.id)),
  );

  ignore(id: number): void {
    const ignoredSystemNotifications = this.ignoredSystemNotifications().slice();
    ignoredSystemNotifications.push(id);
    this.ignoredSystemNotifications.set(ignoredSystemNotifications);
    st_set(this.storageKey, JSON.stringify(this.ignoredSystemNotifications()), 60 * 60 * 24);
  }

  ignoreAll(): void {
    this.ignoredSystemNotifications.set(this.allSystemNotifications().map((it) => it.id));
    st_set(this.storageKey, JSON.stringify(this.ignoredSystemNotifications()), 60 * 60 * 24);
  }

  resetIgnore(): void {
    st_remove(this.storageKey);
    this.ignoredSystemNotifications.set([]);
  }
}
