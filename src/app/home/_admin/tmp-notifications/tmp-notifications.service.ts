import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';

import {TempNotification} from '@shared/waiterrobot-backend';

import {BehaviorSubject, map, Observable, switchMap} from 'rxjs';

@Injectable({providedIn: 'root'})
export class TmpNotificationsService {
  #httpClient = inject(HttpClient);
  #url = '/public/temp-notifications';

  #triggerGet$ = new BehaviorSubject(true);

  getAll$(): Observable<TempNotification[]> {
    return this.#triggerGet$.pipe(switchMap(() => this.#httpClient.get<TempNotification[]>(this.#url)));
  }

  getSingle$(id: string): Observable<TempNotification | undefined> {
    return this.getAll$().pipe(map((notifications) => notifications.find((it) => it.id === id)));
  }
}
