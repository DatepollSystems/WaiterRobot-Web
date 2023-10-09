import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {BehaviorSubject, map, Observable, switchMap, take, tap} from 'rxjs';

import {s_from} from 'dfts-helper';
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
      switchMap(() => this.eventsService.getSelectedNotNull$),
      switchMap(({id: eventId}) => this.httpClient.get<GetProductGroupResponse[]>(this.url, {params: {eventId}})),
      map((it) => it.sort((a, b) => (a.position ?? 100000) - (b.position ?? 100000))),
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
    return this.eventsService.getSelectedNotNull$.pipe(
      take(1),
      switchMap(({id: eventId}) => this.httpClient.patch<IdResponse[]>(`${this.url}/order`, dto, {params: {eventId}})),
      tap(() => this.triggerGet$.next(true)),
    );
  }
}
