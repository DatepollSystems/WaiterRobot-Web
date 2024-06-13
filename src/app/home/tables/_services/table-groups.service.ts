import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';

import {HasCreateWithIdResponse, HasOrdered, HasUpdateWithIdResponse} from '@shared/services/services.interface';

import {CreateTableGroupDto, EntityOrderDto, GetTableGroupResponse, IdResponse, UpdateTableGroupDto} from '@shared/waiterrobot-backend';

import {s_from} from 'dfts-helper';
import {HasDelete, HasGetAll, HasGetSingle} from 'dfx-helper';

import {BehaviorSubject, map, Observable, switchMap, tap} from 'rxjs';
import {SelectedEventService} from '../../events/_services/selected-event.service';

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

  private httpClient = inject(HttpClient);
  private selectedEventService = inject(SelectedEventService);

  triggerGet$ = new BehaviorSubject(true);

  #sortByPositionAndName(a: GetTableGroupResponse, b: GetTableGroupResponse) {
    // Default to a high value if position is undefined
    const groupPositionA = a.position ?? 100000;
    const groupPositionB = b.position ?? 100000;

    // First compare by position
    if (groupPositionA !== groupPositionB) {
      return groupPositionA - groupPositionB;
    }

    // If positions are the same or undefined, compare by name
    const groupNameCompare = a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase());
    return groupNameCompare;
  }

  getAll$(): Observable<GetTableGroupResponse[]> {
    return this.triggerGet$.pipe(
      switchMap(() => this.selectedEventService.selectedIdNotNull$),
      switchMap((eventId) => this.httpClient.get<GetTableGroupResponse[]>(this.url, {params: {eventId}})),
      map((it) => it.sort(this.#sortByPositionAndName)),
    );
  }

  getSingle$(id: number): Observable<GetTableGroupResponse> {
    return this.httpClient.get<GetTableGroupResponse>(`${this.url}/${s_from(id)}`);
  }

  create$(dto: CreateTableGroupDto): Observable<IdResponse> {
    return this.httpClient.post<IdResponse>(this.url, dto).pipe(
      tap(() => {
        this.triggerGet$.next(true);
      }),
    );
  }

  update$(dto: UpdateTableGroupDto): Observable<IdResponse> {
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

  order$(dto: EntityOrderDto[]): Observable<IdResponse[]> {
    return this.httpClient
      .patch<IdResponse[]>(`${this.url}/order`, dto, {
        params: {eventId: this.selectedEventService.selectedId()!},
      })
      .pipe(
        tap(() => {
          this.triggerGet$.next(true);
        }),
      );
  }
}
