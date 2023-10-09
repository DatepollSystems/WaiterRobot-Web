import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {BehaviorSubject, map, Observable, switchMap, take, tap} from 'rxjs';

import {s_from} from 'dfts-helper';
import {HasDelete, HasGetAll, HasGetSingle} from 'dfx-helper';

import {HasCreateWithIdResponse, HasOrdered, HasUpdateWithIdResponse} from '../../../_shared/services/services.interface';
import {
  CreateTableGroupDto,
  EntityOrderDto,
  GetTableGroupResponse,
  IdResponse,
  UpdateTableGroupDto,
} from '../../../_shared/waiterrobot-backend';
import {EventsService} from '../../events/_services/events.service';

@Injectable({providedIn: 'root'})
export class TableGroupsService
  implements
    HasGetAll<GetTableGroupResponse>,
    HasGetSingle<GetTableGroupResponse>,
    HasCreateWithIdResponse<CreateTableGroupDto>,
    HasUpdateWithIdResponse<UpdateTableGroupDto>,
    HasDelete<GetTableGroupResponse>,
    HasOrdered<GetTableGroupResponse>
{
  url = '/config/table/group';

  constructor(
    private httpClient: HttpClient,
    private eventsService: EventsService,
  ) {}

  triggerGet$ = new BehaviorSubject(true);

  getAll$(): Observable<GetTableGroupResponse[]> {
    return this.triggerGet$.pipe(
      switchMap(() => this.eventsService.getSelectedNotNull$),
      switchMap(({id: eventId}) => this.httpClient.get<GetTableGroupResponse[]>(this.url, {params: {eventId}})),
      map((it) => it.sort((a, b) => (a.position ?? 1000000) - (b.position ?? 1000000))),
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

  order$(dto: EntityOrderDto[]): Observable<IdResponse[]> {
    return this.eventsService.getSelectedNotNull$.pipe(
      take(1),
      switchMap((event) =>
        this.httpClient.patch<IdResponse[]>(`${this.url}/order`, dto, {
          params: {eventId: event.id},
        }),
      ),
      tap(() => this.triggerGet$.next(true)),
    );
  }
}
