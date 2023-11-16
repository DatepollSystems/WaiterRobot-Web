import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';

import {BehaviorSubject, map, Observable, switchMap, tap} from 'rxjs';

import {s_from} from 'dfts-helper';
import {HasDelete, HasGetAll, HasGetByParent, HasGetSingle} from 'dfx-helper';

import {HasCreateWithIdResponse, HasUpdateWithIdResponse} from '../../../_shared/services/services.interface';
import {
  CreateProductDto,
  EntityOrderDto,
  GetProductGroupResponse,
  GetProductMaxResponse,
  GetProductResponse,
  IdResponse,
  UpdateProductDto,
} from '../../../_shared/waiterrobot-backend';
import {SelectedEventService} from '../../events/_services/selected-event.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService
  implements
    HasGetAll<GetProductMaxResponse>,
    HasGetSingle<GetProductMaxResponse>,
    HasCreateWithIdResponse<CreateProductDto>,
    HasUpdateWithIdResponse<UpdateProductDto>,
    HasGetByParent<GetProductMaxResponse, GetProductGroupResponse>,
    HasDelete<GetProductResponse>
{
  url = '/config/product';

  private httpClient = inject(HttpClient);
  private selectedEventService = inject(SelectedEventService);

  triggerGet$ = new BehaviorSubject(true);

  getAll$(): Observable<GetProductMaxResponse[]> {
    return this.triggerGet$.pipe(
      switchMap(() => this.selectedEventService.selectedIdNotNull$),
      switchMap((eventId) => this.httpClient.get<GetProductMaxResponse[]>(this.url, {params: {eventId}})),
      map((products) => products.sort((a, b) => (a.position ?? 100000) - (b.position ?? 100000))),
    );
  }

  getByParent$(groupId: number): Observable<GetProductMaxResponse[]> {
    return this.triggerGet$.pipe(
      switchMap(() => this.httpClient.get<GetProductMaxResponse[]>(this.url, {params: {groupId}})),
      map((products) => products.sort((a, b) => (a.position ?? 100000) - (b.position ?? 100000))),
    );
  }

  getSingle$(id: number): Observable<GetProductMaxResponse> {
    return this.httpClient.get<GetProductMaxResponse>(`${this.url}/${s_from(id)}`);
  }

  create$(dto: CreateProductDto): Observable<IdResponse> {
    return this.httpClient.post<IdResponse>(this.url, dto).pipe(tap(() => this.triggerGet$.next(true)));
  }

  update$(dto: UpdateProductDto): Observable<IdResponse> {
    return this.httpClient.put<IdResponse>(this.url, dto).pipe(tap(() => this.triggerGet$.next(true)));
  }

  delete$(id: number): Observable<unknown> {
    return this.httpClient.delete(`${this.url}/${s_from(id)}`).pipe(tap(() => this.triggerGet$.next(true)));
  }

  order$(groupId: number, dto: EntityOrderDto[]): Observable<IdResponse[]> {
    return this.httpClient
      .patch<IdResponse[]>(`${this.url}/order`, dto, {
        params: {groupId},
      })
      .pipe(tap(() => this.triggerGet$.next(true)));
  }
}
