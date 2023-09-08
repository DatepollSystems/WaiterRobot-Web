import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {BehaviorSubject, filter, Observable, switchMap, tap} from 'rxjs';

import {notNullAndUndefined, s_from} from 'dfts-helper';
import {HasDelete, HasGetAll, HasGetByParent, HasGetSingle} from 'dfx-helper';


import {HasCreateWithIdResponse, HasUpdateWithIdResponse} from '../../../_shared/services/services.interface';
import {CreateTableDto, GetTableGroupResponse, GetTableResponse, IdResponse, UpdateTableDto} from '../../../_shared/waiterrobot-backend';
import {EventsService} from '../../events/_services/events.service';

@Injectable({providedIn: 'root'})
export class TablesService
  implements
    HasGetAll<GetTableResponse>,
    HasGetSingle<GetTableResponse>,
    HasCreateWithIdResponse<CreateTableDto>,
    HasUpdateWithIdResponse<UpdateTableDto>,
    HasGetByParent<GetTableResponse, GetTableGroupResponse>,
    HasDelete<GetTableResponse>
{
  url = '/config/table';

  constructor(
    private httpClient: HttpClient,
    private eventsService: EventsService,
  ) {}

  triggerGet$ = new BehaviorSubject(true);

  getAll$(): Observable<GetTableResponse[]> {
    return this.triggerGet$.pipe(
      switchMap(() =>
        this.eventsService.getSelected$.pipe(
          filter(notNullAndUndefined),
          switchMap((selected) =>
            this.httpClient.get<GetTableResponse[]>(this.url, {params: new HttpParams().set('eventId', selected.id)}),
          ),
        ),
      ),
    );
  }

  getByParent$(id: number): Observable<GetTableResponse[]> {
    return this.triggerGet$.pipe(
      switchMap(() => this.httpClient.get<GetTableResponse[]>(this.url, {params: new HttpParams().set('groupId', id)})),
    );
  }

  getSingle$(id: number): Observable<GetTableResponse> {
    return this.httpClient.get<GetTableResponse>(`${this.url}/${s_from(id)}`);
  }

  create$(dto: CreateTableDto): Observable<IdResponse> {
    return this.httpClient.post<IdResponse>(this.url, dto).pipe(tap(() => this.triggerGet$.next(true)));
  }

  update$(dto: UpdateTableDto): Observable<IdResponse> {
    return this.httpClient.put<IdResponse>(this.url, dto).pipe(tap(() => this.triggerGet$.next(true)));
  }

  delete$(id: number): Observable<unknown> {
    return this.httpClient.delete(`${this.url}/${s_from(id)}`).pipe(tap(() => this.triggerGet$.next(true)));
  }

  checkIfExists(groupId: number, tableNumber: number): Observable<boolean> {
    let params = new HttpParams();
    params = params.append('groupId', groupId);
    params = params.append('tableNumber', tableNumber);

    return this.httpClient.get<boolean>('/config/table/existsByGroupIdAndNumber', {params});
  }
}
