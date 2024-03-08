import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';

import {HasCreateWithIdResponse, HasOrdered, HasUpdateWithIdResponse} from '@shared/services/services.interface';
import {
  CreateProductGroupDto,
  EntityOrderDto,
  GetProductGroupResponse,
  IdResponse,
  UpdateProductGroupDto,
} from '@shared/waiterrobot-backend';

import {s_from} from 'dfts-helper';
import {HasDelete, HasGetAll, HasGetSingle} from 'dfx-helper';

import {BehaviorSubject, map, Observable, switchMap, tap} from 'rxjs';
import {SelectedEventService} from '../../events/_services/selected-event.service';

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

  private httpClient = inject(HttpClient);
  private selectedEventService = inject(SelectedEventService);

  triggerGet$ = new BehaviorSubject(true);

  getAll$(): Observable<GetProductGroupResponse[]> {
    return this.triggerGet$.pipe(
      switchMap(() => this.selectedEventService.selectedIdNotNull$),
      switchMap((eventId) => this.httpClient.get<GetProductGroupResponse[]>(this.url, {params: {eventId}})),
      map((it) => it.sort((a, b) => (a.position ?? 100000) - (b.position ?? 100000))),
    );
  }

  getSingle$(id: number): Observable<GetProductGroupResponse> {
    return this.httpClient.get<GetProductGroupResponse>(`${this.url}/${s_from(id)}`);
  }

  create$(dto: CreateProductGroupDto): Observable<IdResponse> {
    return this.httpClient.post<IdResponse>(this.url, dto).pipe(
      tap(() => {
        this.triggerGet$.next(true);
      }),
    );
  }

  update$(dto: UpdateProductGroupDto): Observable<IdResponse> {
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
      .patch<IdResponse[]>(`${this.url}/order`, dto, {params: {eventId: this.selectedEventService.selectedId() ?? 'UNKNOWN'}})
      .pipe(
        tap(() => {
          this.triggerGet$.next(true);
        }),
      );
  }
}
