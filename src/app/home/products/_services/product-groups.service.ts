import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {notNullAndUndefined, s_from} from 'dfts-helper';
import {HasDelete, HasGetAll, HasGetSingle} from 'dfx-helper';
import {BehaviorSubject, filter, map, Observable, switchMap, tap} from 'rxjs';
import {HasCreateWithIdResponse, HasUpdateWithIdResponse} from '../../../_shared/services/services.interface';

import {
  CreateProductGroupDto,
  GetProductGroupResponse,
  GetProductResponse,
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
            this.httpClient.get<GetProductGroupResponse[]>(this.url, {params: new HttpParams().set('eventId', selected.id)})
          ),
          map((it) => it.sort((a, b) => a.name.trim().toLowerCase().localeCompare(b.name.trim().toLowerCase())))
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
