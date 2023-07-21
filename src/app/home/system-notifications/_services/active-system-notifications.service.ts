import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, switchMap} from 'rxjs';

import {GetSystemNotificationResponse} from '../../../_shared/waiterrobot-backend';

@Injectable({providedIn: 'root'})
export class ActiveSystemNotificationsService {
  url = '/system-notification';

  constructor(private httpClient: HttpClient) {}

  triggerGet$ = new BehaviorSubject(true);

  getAll$(): Observable<GetSystemNotificationResponse[]> {
    return this.triggerGet$.pipe(switchMap(() => this.httpClient.get<GetSystemNotificationResponse[]>(this.url)));
  }
}
