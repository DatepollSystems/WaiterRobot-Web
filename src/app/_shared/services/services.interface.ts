import {HttpParams} from '@angular/common/http';
import {inject, Signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';

import {map, Observable} from 'rxjs';

import {SortDirection} from 'dfx-bootstrap-table/lib/sort/sort-direction';

import {IHasID, n_from} from 'dfts-helper';
import {HasCreate, HasUpdate} from 'dfx-helper';

import {IdResponse} from '../waiterrobot-backend';

export type HasCreateWithIdResponse<CreateDTOType> = HasCreate<CreateDTOType, IdResponse>;

export type HasUpdateWithIdResponse<UpdateDTOType extends IHasID<UpdateDTOType['id']>> = HasUpdate<UpdateDTOType, IdResponse>;

export type HasIdAndNumber<ID> = IHasID<ID> & {number: number};

export interface HasOrdered<T extends IHasID<T['id']>> {
  order$(dto: {entityId: T['id']; order: number}[]): Observable<IdResponse[]>;
}

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

export function getSort(active?: string, direction?: 'asc' | 'desc' | ''): string | undefined {
  let sort = undefined;
  if (!(!active || !direction || (direction as unknown) === '')) {
    sort = `${active},${direction}`;
  }
  return sort;
}

export function injectPaginationAndSortParams(
  defaultSortBy: string,
  defaultSortDirection: SortDirection = 'desc',
): Signal<{page: number; size: number; sort: string; direction: SortDirection}> {
  const activatedRoute = inject(ActivatedRoute);

  return toSignal(
    activatedRoute.queryParamMap.pipe(
      map((it) => ({
        page: it.get('page') ? n_from(it.get('page')) : 0,
        size: it.get('size') ? n_from(it.get('size')) : 20,
        sort: it.get('sort') ?? defaultSortBy,
        direction: (it.get('direction') as SortDirection | undefined) ?? defaultSortDirection,
      })),
    ),
    {
      initialValue: {
        page: 0,
        size: 20,
        sort: defaultSortBy,
        direction: defaultSortDirection,
      },
    },
  );
}
