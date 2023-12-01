import {HttpParams} from '@angular/common/http';
import {inject, signal, Signal, WritableSignal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {ActivatedRoute, Router} from '@angular/router';

import {map, Observable} from 'rxjs';

import {n_from} from 'dfts-helper';
import {SortDirection} from 'dfx-bootstrap-table';

import {PaginationResponse} from '../../../_shared/services/services.interface';

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

export function getSortParam(active?: string, direction: 'asc' | 'desc' | '' = ''): string | undefined {
  return active && direction !== '' ? `${active},${direction}` : undefined;
}

export function injectPagination(
  defaultSortBy: string,
  defaultSortDirection: SortDirection = 'desc',
): {
  params: Signal<{page: number; size: number; sort: string; direction: SortDirection}>;
  totalElements: WritableSignal<number>;
  loading: WritableSignal<boolean>;
  activatedRoute: ActivatedRoute;
  updateParams: (queryParams: {size: number; page: number; sort: string; direction: SortDirection}) => void;
} {
  const activatedRoute = inject(ActivatedRoute);
  const router = inject(Router);

  const params = toSignal(
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

  const loading = signal(true);
  const totalElements = signal<number>(0);

  const updateParams = (queryParams: {size: number; page: number; sort: string; direction: string}): void =>
    void router.navigate([], {
      relativeTo: activatedRoute,
      queryParamsHandling: 'merge',
      queryParams,
    });

  return {
    params,
    loading,
    totalElements,
    activatedRoute,
    updateParams,
  };
}
