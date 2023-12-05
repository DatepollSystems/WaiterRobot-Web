import {HttpClient} from '@angular/common/http';
import {inject, Injectable, signal} from '@angular/core';

import {BehaviorSubject, Observable, switchMap} from 'rxjs';

import {TempNotification} from '../../../_shared/waiterrobot-backend';

@Injectable({providedIn: 'root'})
export class TmpNotificationsService {
  private httpClient = inject(HttpClient);
  url = '/public/temp-notifications';

  triggerGet$ = new BehaviorSubject(true);

  getAll$(): Observable<TempNotification[]> {
    return this.triggerGet$.pipe(switchMap(() => this.httpClient.get<TempNotification[]>(`${this.url}`)));
  }

  single = signal<TempNotification | undefined>(undefined);
}
