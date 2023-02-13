import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {
  CreateProductGroupDto,
  GetProductGroupResponse,
  GetProductResponse,
  IdResponse,
  UpdateProductGroupDto,
} from '../../../_shared/waiterrobot-backend';
import {EventsService} from '../../events/_services/events.service';
import {
  HasCreateWithIdResponse,
  HasDelete,
  HasGetAll,
  HasGetSingle,
  HasUpdateWithIdResponse,
  notNullAndUndefined,
} from '../../../_shared/services/abstract-entity.service';
import {BehaviorSubject, filter, Observable, switchMap} from 'rxjs';
import {s_from} from 'dfts-helper';
import {tap} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class ProductGroupsService
  implements
    HasGetAll<GetProductGroupResponse>,
    HasGetSingle<GetProductGroupResponse>,
    HasCreateWithIdResponse<CreateProductGroupDto>,
    HasUpdateWithIdResponse<UpdateProductGroupDto>,
    HasDelete<GetProductResponse>
{
  url = '/config/product/group';

  constructor(private httpClient: HttpClient, private eventsService: EventsService) {}

  triggerGet$ = new BehaviorSubject(true);

  getAll$(): Observable<GetProductGroupResponse[]> {
    return this.triggerGet$.pipe(
      switchMap(() =>
        this.eventsService.getSelected$.pipe(
          filter(notNullAndUndefined),
          switchMap((selected) =>
            this.httpClient.get<GetProductGroupResponse[]>(`${this.url}`, {params: new HttpParams().set('eventId', selected.id)})
          )
        )
      )
    );
  }

  getSingle$(id: number): Observable<GetProductGroupResponse> {
    return this.httpClient.get<GetProductGroupResponse>(`${this.url}/${s_from(id)}`);
  }

  create$(dto: CreateProductGroupDto): Observable<IdResponse> {
    return this.httpClient.post<IdResponse>(this.url, dto).pipe(tap(() => this.triggerGet$.next(true)));
  }

  update$(dto: UpdateProductGroupDto): Observable<IdResponse> {
    return this.httpClient.put<IdResponse>(this.url, dto).pipe(tap(() => this.triggerGet$.next(true)));
  }

  delete$(id: number): Observable<unknown> {
    return this.httpClient.delete(`${this.url}/${s_from(id)}`).pipe(tap(() => this.triggerGet$.next(true)));
  }
}
