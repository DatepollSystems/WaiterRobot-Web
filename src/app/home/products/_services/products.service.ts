import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {s_from} from 'dfts-helper';
import {filter, map, Observable, switchMap} from 'rxjs';
import {HasDelete, HasGetAll, HasGetByParent, HasGetSingle, notNullAndUndefined} from '../../../_shared/services/abstract-entity.service';
import {AbstractModelService} from '../../../_shared/services/abstract-model.service';
import {GetProductGroupResponse, GetProductMaxResponse, GetProductResponse} from '../../../_shared/waiterrobot-backend';

import {EventsService} from '../../events/_services/events.service';

import {ProductModel} from '../_models/product.model';

@Injectable()
export class ProductsService extends AbstractModelService<ProductModel> {
  override url = '/config/product';

  constructor(httpService: HttpClient, private eventsService: EventsService) {
    super(httpService);

    this.setGetAllParams([{key: 'eventId', value: eventsService.getSelected()?.id}]);
    this.eventsService.getSelected$.subscribe((event) => {
      if (event) {
        this.setGetAllParams([{key: 'eventId', value: event.id}]);
        this.getAll();
      }
    });
  }

  public setSelectedEventGetAllUrl(): void {
    this.setGetAllParams([{key: 'eventId', value: this.eventsService.getSelected()?.id}]);
  }

  protected convert(data: any): ProductModel {
    return new ProductModel(data as GetProductMaxResponse);
  }
}

@Injectable({
  providedIn: 'root',
})
export class ProductsServiceV2
  implements
    HasGetAll<GetProductMaxResponse>,
    HasGetSingle<GetProductMaxResponse>,
    HasDelete<GetProductResponse>,
    HasGetByParent<GetProductMaxResponse, GetProductGroupResponse>
{
  url = '/config/product';

  constructor(private httpClient: HttpClient, private eventsService: EventsService) {}

  priceMap = map((p: GetProductMaxResponse[]) =>
    p.map((ps) => {
      ps.price = ps.price / 100;
      return ps;
    })
  );

  getAll$(): Observable<GetProductMaxResponse[]> {
    return this.eventsService.getSelected$.pipe(
      filter(notNullAndUndefined),
      switchMap((selected) =>
        this.httpClient
          .get<GetProductMaxResponse[]>(`${this.url}`, {params: new HttpParams().set('eventId', selected.id)})
          .pipe(this.priceMap)
      )
    );
  }

  getByParent$(id: number): Observable<GetProductMaxResponse[]> {
    return this.httpClient.get<GetProductMaxResponse[]>(`${this.url}`, {params: new HttpParams().set('groupId', id)}).pipe(this.priceMap);
  }

  getSingle$(id: number): Observable<GetProductMaxResponse> {
    return this.httpClient.get<GetProductMaxResponse>(`${this.url}/${s_from(id)}`).pipe(
      map((ps) => {
        ps.price = ps.price / 100;
        return ps;
      })
    );
  }

  delete$(id: number): Observable<unknown> {
    return this.httpClient.delete(`${this.url}/${s_from(id)}`);
  }
}
