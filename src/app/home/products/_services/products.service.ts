import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';

import {HasCreateWithIdResponse, HasUpdateWithIdResponse} from '@shared/services/services.interface';
import {
  CreateProductDto,
  EntityOrderDto,
  GetProductGroupResponse,
  GetProductMaxResponse,
  GetProductResponse,
  IdResponse,
  UpdateProductDto,
} from '@shared/waiterrobot-backend';

import {s_from} from 'dfts-helper';
import {HasDelete, HasGetAll, HasGetByParent, HasGetSingle} from 'dfx-helper';

import {BehaviorSubject, map, Observable, switchMap, tap} from 'rxjs';
import {SelectedEventService} from '../../_admin/events/_services/selected-event.service';

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

  #sortByPositionAndName(a: GetProductMaxResponse, b: GetProductMaxResponse) {
    // Default to a high value if position is undefined
    const groupPositionA = a.group.position ?? 100000;
    const groupPositionB = b.group.position ?? 100000;

    // First compare by group position
    if (groupPositionA !== groupPositionB) {
      return groupPositionA - groupPositionB;
    }

    // If positions are the same or undefined, compare by group name
    const groupNameCompare = a.group.name.toLocaleLowerCase().localeCompare(b.group.name.toLocaleLowerCase());
    if (groupNameCompare !== 0) {
      return groupNameCompare;
    }

    // If group names are the same, compare by product position
    // Default to a high value if position is undefined
    const positionA = a.position ?? 100000;
    const positionB = b.position ?? 100000;

    // First compare by product position
    if (positionA !== positionB) {
      return positionA - positionB;
    }

    // If positions are the same or undefined, compare by product name
    return a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase());
  }

  getAll$(): Observable<GetProductMaxResponse[]> {
    return this.triggerGet$.pipe(
      switchMap(() => this.selectedEventService.selectedIdNotNull$),
      switchMap((eventId) => this.httpClient.get<GetProductMaxResponse[]>(this.url, {params: {eventId}})),
      map((products) => products.sort(this.#sortByPositionAndName)),
    );
  }

  getByParent$(groupId: number): Observable<GetProductMaxResponse[]> {
    return this.triggerGet$.pipe(
      switchMap(() => this.httpClient.get<GetProductMaxResponse[]>(this.url, {params: {groupId}})),
      map((products) => products.sort(this.#sortByPositionAndName)),
    );
  }

  getSingle$(id: number): Observable<GetProductMaxResponse> {
    return this.httpClient.get<GetProductMaxResponse>(`${this.url}/${s_from(id)}`);
  }

  create$(dto: CreateProductDto): Observable<IdResponse> {
    return this.httpClient.post<IdResponse>(this.url, dto).pipe(
      tap(() => {
        this.triggerGet$.next(true);
      }),
    );
  }

  update$(dto: UpdateProductDto): Observable<IdResponse> {
    return this.httpClient.put<IdResponse>(this.url, dto).pipe(
      tap(() => {
        this.triggerGet$.next(true);
      }),
    );
  }

  toggleSoldOut$(dto: GetProductMaxResponse, soldOut?: boolean) {
    return this.httpClient
      .put<IdResponse>(this.url, {
        ...dto,
        soldOut: soldOut ?? !dto.soldOut,
        allergenIds: dto.allergens.map((it) => it.id),
        groupId: dto.group.id,
        printerId: dto.printer.id,
      } satisfies UpdateProductDto)
      .pipe(
        tap(() => {
          this.triggerGet$.next(true);
        }),
      );
  }

  delete$(id: number): Observable<unknown> {
    return this.httpClient.delete(`${this.url}/${s_from(id)}`);
  }

  unDelete$(id: number): Observable<unknown> {
    return this.httpClient.delete(`${this.url}/${s_from(id)}/undo`);
  }

  order$(groupId: number, dto: EntityOrderDto[]): Observable<IdResponse[]> {
    return this.httpClient
      .patch<IdResponse[]>(`${this.url}/order`, dto, {
        params: {groupId},
      })
      .pipe(
        tap(() => {
          this.triggerGet$.next(true);
        }),
      );
  }
}
