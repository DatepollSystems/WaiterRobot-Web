import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {s_from} from 'dfts-helper';
import {BehaviorSubject, Observable, switchMap, tap} from 'rxjs';
import {
  HasCreateWithIdResponse,
  HasDelete,
  HasGetAll,
  HasGetByParent,
  HasGetSingle,
  HasUpdateWithIdResponse,
} from '../../../_shared/services/abstract-entity.service';

import {
  CreateWaiterDto,
  GetEventOrLocationResponse,
  GetWaiterResponse,
  IdResponse,
  UpdateWaiterDto,
} from '../../../_shared/waiterrobot-backend';

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
  url = '/config/waiter';

  constructor(private httpClient: HttpClient) {}

  triggerGet$ = new BehaviorSubject(true);

  getAll$(): Observable<GetWaiterResponse[]> {
    return this.triggerGet$.pipe(switchMap(() => this.httpClient.get<GetWaiterResponse[]>(this.url)));
  }

  getSingle$(id: number): Observable<GetWaiterResponse> {
    return this.httpClient.get<GetWaiterResponse>(`${this.url}/${s_from(id)}`);
  }

  getByParent$(id: number): Observable<GetWaiterResponse[]> {
    return this.triggerGet$.pipe(
      switchMap(() => this.httpClient.get<GetWaiterResponse[]>(this.url, {params: new HttpParams().set('eventId', id)}))
    );
  }

  create$(dto: CreateWaiterDto): Observable<IdResponse> {
    return this.httpClient.post<IdResponse>(this.url, dto).pipe(tap(() => this.triggerGet$.next(true)));
  }

  update$(dto: UpdateWaiterDto): Observable<IdResponse> {
    return this.httpClient.put<IdResponse>(this.url, dto).pipe(tap(() => this.triggerGet$.next(true)));
  }

  delete$(id: number): Observable<unknown> {
    return this.httpClient.delete(`${this.url}/${s_from(id)}`).pipe(tap(() => this.triggerGet$.next(true)));
  }
}
