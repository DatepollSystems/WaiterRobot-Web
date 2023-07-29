import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {s_from} from 'dfts-helper';
import {HasDelete, HasGetAll, HasGetSingle} from 'dfx-helper';
import {BehaviorSubject, map, Observable, switchMap, tap} from 'rxjs';
import {HasCreateWithIdResponse, HasUpdateWithIdResponse} from '../../../_shared/services/services.interface';

import {
  CreateSystemNotificationDto,
  GetSystemNotificationResponse,
  IdResponse,
  UpdateSystemNotificationDto,
} from '../../../_shared/waiterrobot-backend';
import {ActiveSystemNotificationsService} from './active-system-notifications.service';

@Injectable({providedIn: 'root'})
export class SystemNotificationsService
  implements
    HasGetAll<GetSystemNotificationResponse>,
    HasGetSingle<GetSystemNotificationResponse>,
    HasCreateWithIdResponse<CreateSystemNotificationDto>,
    HasUpdateWithIdResponse<UpdateSystemNotificationDto>,
    HasDelete<GetSystemNotificationResponse>
{
  url = '/system-notification';

  constructor(
    private httpClient: HttpClient,
    private activeSystemNotificationsService: ActiveSystemNotificationsService,
  ) {}

  triggerGet$ = new BehaviorSubject(true);

  getAll$(): Observable<GetSystemNotificationResponse[]> {
    return this.triggerGet$.pipe(switchMap(() => this.httpClient.get<GetSystemNotificationResponse[]>(`${this.url}/all`)));
  }

  getSingle$(id: number): Observable<GetSystemNotificationResponse> {
    return this.getAll$().pipe(map((notifications) => notifications.find((it) => it.id === id)!));
  }

  create$(dto: CreateSystemNotificationDto): Observable<IdResponse> {
    return this.httpClient.post<IdResponse>(this.url, dto).pipe(
      tap(() => {
        this.triggerGet$.next(true);
        this.activeSystemNotificationsService.triggerGet$.next(true);
      }),
    );
  }

  update$(dto: UpdateSystemNotificationDto): Observable<IdResponse> {
    return this.httpClient.put<IdResponse>(this.url, dto).pipe(
      tap(() => {
        this.triggerGet$.next(true);
        this.activeSystemNotificationsService.triggerGet$.next(true);
      }),
    );
  }

  delete$(id: number): Observable<unknown> {
    return this.httpClient.delete(`${this.url}/${s_from(id)}`).pipe(
      tap(() => {
        this.triggerGet$.next(true);
        this.activeSystemNotificationsService.triggerGet$.next(true);
      }),
    );
  }
}

export const systemNotificationTypes = ['INFO', 'WARNING', 'DANGER', 'SUCCESS', 'NEUTRAL'];
