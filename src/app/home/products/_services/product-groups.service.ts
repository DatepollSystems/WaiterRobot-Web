import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {BehaviorSubject, filter, map, Observable, switchMap, tap} from 'rxjs';

import {notNullAndUndefined, s_from} from 'dfts-helper';
import {HasDelete, HasGetAll, HasGetSingle} from 'dfx-helper';

import {HasCreateWithIdResponse, HasOrdered, HasUpdateWithIdResponse} from '../../../_shared/services/services.interface';
import {
  CreateProductGroupDto,
  EntityOrderDto,
  GetProductGroupResponse,
  IdResponse,
  UpdateProductGroupDto,
} from '../../../_shared/waiterrobot-backend';
import {EventsService} from '../../events/_services/events.service';

@Injectable({providedIn: 'root'})
export class ProductGroupsService
  implements
    HasGetAll<GetProductGroupResponse>,
    HasGetSingle<GetProductGroupResponse>,
    HasCreateWithIdResponse<CreateProductGroupDto>,
    HasUpdateWithIdResponse<UpdateProductGroupDto>,
    HasDelete<GetProductGroupResponse>,
    HasOrdered<GetProductGroupResponse>
{
  url = '/config/product/group';

  constructor(
    private httpClient: HttpClient,
    private eventsService: EventsService,
  ) {}

  triggerGet$ = new BehaviorSubject(true);

  getAll$(): Observable<GetProductGroupResponse[]> {
    return this.triggerGet$.pipe(
      switchMap(() =>
        this.eventsService.getSelected$.pipe(
          filter(notNullAndUndefined),
          switchMap((selected) =>
            this.httpClient.get<GetProductGroupResponse[]>(this.url, {params: new HttpParams().set('eventId', selected.id)}),
          ),
          map((it) => it.sort((a, b) => (a.position ?? 100000) - (b.position ?? 100000))),
        ),
      ),
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

  order$(dto: EntityOrderDto[]): Observable<IdResponse[]> {
    return this.eventsService.getSelected$.pipe(
      switchMap((event) =>
        this.httpClient.patch<IdResponse[]>(`${this.url}/order`, dto, {
          params: new HttpParams().set('eventId', event?.id ?? ''),
        }),
      ),
      tap(() => this.triggerGet$.next(true)),
    );
  }
}
