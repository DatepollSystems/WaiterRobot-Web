import {IHasID} from 'dfts-helper';
import {HasCreate, HasUpdate} from 'dfx-helper';
import {IdResponse} from '../waiterrobot-backend';
import {Observable} from 'rxjs';
import {HttpParams} from '@angular/common/http';

export type HasCreateWithIdResponse<CreateDTOType> = HasCreate<CreateDTOType, IdResponse>;

export type HasUpdateWithIdResponse<UpdateDTOType extends IHasID<UpdateDTOType['id']>> = HasUpdate<UpdateDTOType, IdResponse>;

export type HasIdAndNumber<ID> = IHasID<ID> & {number: number};

export type PaginationResponse<T> = {numberOfItems: number; numberOfPages: number; data: T[]};

export type PageableDto = {
  /**
   * @format int32
   * @min 0
   */
  page?: number;
  /**
   * @format int32
   * @min 1
   */
  size?: number;
  sort?: string;
  query?: string;
};

export type GetPaginatedFn<T> = (options: PageableDto) => Observable<PaginationResponse<T>>;

export function getPaginationParams(options: PageableDto): HttpParams {
  let params = new HttpParams();
  params = params.append('page', options.page ?? 0);
  params = params.append('size', options.size ?? 10);
  if (options.sort) {
    params = params.append('sort', options.sort);
  }
  if (options.query && options.query.length > 0) {
    params = params.append('query', options.query);
  }
  return params;
}
