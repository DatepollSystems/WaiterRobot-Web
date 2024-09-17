import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {getPaginationParams, PageableDto} from '@home-shared/services/pagination';

import {HasCreateWithIdResponse, HasOrdered, HasUpdateWithIdResponse} from '@shared/services/services.interface';
import {
  CreateProductGroupDto,
  EntityOrderDto,
  GetProductGroupResponse,
  IdResponse,
  PaginatedResponseGetProductGroupMaxResponse,
  UpdateProductGroupDto,
} from '@shared/waiterrobot-backend';

import {s_from} from 'dfts-helper';
import {HasDelete, HasGetAll, HasGetSingle} from 'dfx-helper';

import {BehaviorSubject, combineLatest, map, Observable, switchMap, tap} from 'rxjs';
import {SelectedEventService} from '../../_admin/events/_services/selected-event.service';

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

  #sortByPositionAndName(a: GetProductGroupResponse, b: GetProductGroupResponse) {
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

  getAll$(): Observable<GetProductGroupResponse[]> {
    return combineLatest([this.selectedEventService.selectedIdNotNull$, this.triggerGet$]).pipe(
      switchMap(([eventId]) => this.httpClient.get<GetProductGroupResponse[]>(this.url, {params: {eventId}})),
      map((it) => it.sort(this.#sortByPositionAndName)),
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
    return this.httpClient.delete(`${this.url}/${s_from(id)}`);
  }

  unDelete$(id: number): Observable<unknown> {
    return this.httpClient.delete(`${this.url}/${s_from(id)}/undo`);
  }

  getAllDeleted$(options: PageableDto): Observable<PaginatedResponseGetProductGroupMaxResponse> {
    return combineLatest([this.selectedEventService.selectedIdNotNull$, this.triggerGet$]).pipe(
      switchMap(([eventId]) =>
        this.httpClient.get<PaginatedResponseGetProductGroupMaxResponse>(`${this.url}/deleted`, {
          params: getPaginationParams(options).append('eventId', eventId),
        }),
      ),
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
