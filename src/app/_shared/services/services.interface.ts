import {IHasID} from 'dfts-helper';
import {HasCreate, HasUpdate} from 'dfx-helper';
import {IdResponse} from '../waiterrobot-backend';
import {Observable} from 'rxjs';

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

export type HasGetPaginated<T> = {
  getAllPaginated$(options: PageableDto): Observable<PaginationResponse<T>>;
};
