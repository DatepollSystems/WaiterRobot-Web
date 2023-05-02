import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {notNullAndUndefined, s_from} from 'dfts-helper';
import {HasDelete, HasGetAll, HasGetSingle} from 'dfx-helper';
import {BehaviorSubject, filter, Observable, switchMap, tap} from 'rxjs';
import {HasCreateWithIdResponse, HasUpdateWithIdResponse} from '../../../_shared/services/services.interface';

import {CreateTableGroupDto, GetTableGroupResponse, IdResponse, UpdateTableGroupDto} from '../../../_shared/waiterrobot-backend';
import {EventsService} from '../../events/_services/events.service';

@Injectable({providedIn: 'root'})
export class TableGroupsService
  implements
    HasGetAll<GetTableGroupResponse>,
    HasGetSingle<GetTableGroupResponse>,
    HasCreateWithIdResponse<CreateTableGroupDto>,
    HasUpdateWithIdResponse<UpdateTableGroupDto>,
    HasDelete<GetTableGroupResponse>
{
  url = '/config/table/group';

  constructor(private httpClient: HttpClient, private eventsService: EventsService) {}

  triggerGet$ = new BehaviorSubject(true);

  getAll$(): Observable<GetTableGroupResponse[]> {
    return this.triggerGet$.pipe(
      switchMap(() =>
        this.eventsService.getSelected$.pipe(
          filter(notNullAndUndefined),
          switchMap((selected) =>
            this.httpClient.get<GetTableGroupResponse[]>(this.url, {params: new HttpParams().set('eventId', selected.id)})
          )
        )
      )
    );
  }

  getSingle$(id: number): Observable<GetTableGroupResponse> {
    return this.httpClient.get<GetTableGroupResponse>(`${this.url}/${s_from(id)}`);
  }

  create$(dto: CreateTableGroupDto): Observable<IdResponse> {
    return this.httpClient.post<IdResponse>(this.url, dto).pipe(tap(() => this.triggerGet$.next(true)));
  }

  update$(dto: UpdateTableGroupDto): Observable<IdResponse> {
    return this.httpClient.put<IdResponse>(this.url, dto).pipe(tap(() => this.triggerGet$.next(true)));
  }

  delete$(id: number): Observable<unknown> {
    return this.httpClient.delete(`${this.url}/${s_from(id)}`).pipe(tap(() => this.triggerGet$.next(true)));
  }
}
