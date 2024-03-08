import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';

import {HasCreateWithIdResponse, HasUpdateWithIdResponse} from '@shared/services/services.interface';
import {CreateWaiterDto, GetEventOrLocationResponse, GetWaiterResponse, IdResponse, UpdateWaiterDto} from '@shared/waiterrobot-backend';

import {s_from} from 'dfts-helper';
import {HasDelete, HasGetAll, HasGetByParent, HasGetSingle} from 'dfx-helper';

import {BehaviorSubject, Observable, switchMap, tap} from 'rxjs';

@Injectable({providedIn: 'root'})
export class WaitersService
  implements
    HasGetAll<GetWaiterResponse>,
    HasGetByParent<GetWaiterResponse, GetEventOrLocationResponse>,
    HasGetSingle<GetWaiterResponse>,
    HasCreateWithIdResponse<CreateWaiterDto>,
    HasUpdateWithIdResponse<UpdateWaiterDto>,
    HasDelete<GetWaiterResponse>
{
  private httpClient = inject(HttpClient);

  url = '/config/waiter';

  triggerGet$ = new BehaviorSubject(true);

  getAll$(): Observable<GetWaiterResponse[]> {
    throw Error('Not implemented');
  }

  getSingle$(id: number): Observable<GetWaiterResponse> {
    return this.httpClient.get<GetWaiterResponse>(`${this.url}/${s_from(id)}`);
  }

  getByParent$(eventId: number): Observable<GetWaiterResponse[]> {
    return this.triggerGet$.pipe(switchMap(() => this.httpClient.get<GetWaiterResponse[]>(this.url, {params: {eventId}})));
  }

  create$(dto: CreateWaiterDto): Observable<IdResponse> {
    return this.httpClient.post<IdResponse>(this.url, dto).pipe(
      tap(() => {
        this.triggerGet$.next(true);
      }),
    );
  }

  update$(dto: UpdateWaiterDto): Observable<IdResponse> {
    return this.httpClient.put<IdResponse>(this.url, dto).pipe(
      tap(() => {
        this.triggerGet$.next(true);
      }),
    );
  }

  delete$(id: number): Observable<unknown> {
    return this.httpClient.delete(`${this.url}/${s_from(id)}`).pipe(
      tap(() => {
        this.triggerGet$.next(true);
      }),
    );
  }
}
