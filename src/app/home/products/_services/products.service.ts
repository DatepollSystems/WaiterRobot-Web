import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {notNullAndUndefined, s_from} from 'dfts-helper';
import {HasDelete, HasGetAll, HasGetByParent, HasGetSingle} from 'dfx-helper';
import {BehaviorSubject, filter, map, Observable, switchMap, tap} from 'rxjs';
import {HasCreateWithIdResponse, HasUpdateWithIdResponse} from '../../../_shared/services/services.interface';
import {
  CreateProductDto,
  GetProductGroupResponse,
  GetProductMaxResponse,
  GetProductResponse,
  IdResponse,
  UpdateProductDto,
} from '../../../_shared/waiterrobot-backend';

import {EventsService} from '../../events/_services/events.service';

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

  constructor(private httpClient: HttpClient, private eventsService: EventsService) {}

  priceMap = map((p: GetProductMaxResponse[]) =>
    p.map((ps) => {
      ps.price = ps.price / 100;
      return ps;
    })
  );

  triggerGet$ = new BehaviorSubject(true);

  getAll$(): Observable<GetProductMaxResponse[]> {
    return this.triggerGet$.pipe(
      switchMap(() =>
        this.eventsService.getSelected$.pipe(
          filter(notNullAndUndefined),
          switchMap((selected) =>
            this.httpClient
              .get<GetProductMaxResponse[]>(this.url, {params: new HttpParams().set('eventId', selected.id)})
              .pipe(this.priceMap)
          )
        )
      )
    );
  }

  getByParent$(id: number): Observable<GetProductMaxResponse[]> {
    return this.triggerGet$.pipe(
      switchMap(() =>
        this.httpClient.get<GetProductMaxResponse[]>(this.url, {params: new HttpParams().set('groupId', id)}).pipe(this.priceMap)
      )
    );
  }

  getSingle$(id: number): Observable<GetProductMaxResponse> {
    return this.httpClient.get<GetProductMaxResponse>(`${this.url}/${s_from(id)}`).pipe(
      map((ps) => {
        ps.price = ps.price / 100;
        return ps;
      })
    );
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
}
