import {HttpParams} from '@angular/common/http';
import {DestroyRef, effect, inject, signal, Signal, WritableSignal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {ActivatedRoute, Router} from '@angular/router';

import {map, merge, Subscription} from 'rxjs';

import {loggerOf, n_from} from 'dfts-helper';
import {NgbPaginator, NgbSort, SortDirection} from 'dfx-bootstrap-table';

export interface PageableDto {
  page: number;
  size: number;
  sort: {
    direction: SortDirection;
    name: string;
  };
  query?: string;
}

export function getPaginationParams(options: PageableDto): HttpParams {
  let params = new HttpParams();
  params = params.append('page', options.page);
  params = params.append('size', options.size);
  params = params.append(
    'sort',
    `${options.sort.name},${options.sort.direction.length > 0 ? options.sort.direction : DEFAULT_SORT_DIRECTION}`,
  );
  if (options.query && options.query.length > 0) {
    params = params.append('query', options.query);
  }
  return params;
}

const DEFAULT_SORT_DIRECTION = 'desc';
const DEFAULT_PAGE_SIZE = 20;

const lumber = loggerOf('pagination');

export function injectPagination({
  defaultSortBy,
  defaultSortDirection,
  defaultPageSize,
  paginator,
  sort,
}: {
  defaultSortBy: string;
  defaultSortDirection?: SortDirection;
  defaultPageSize?: number;
  paginator: Signal<NgbPaginator>;
  sort: Signal<NgbSort>;
}): {
  params: Signal<PageableDto>;
  totalElements: WritableSignal<number>;
  loading: WritableSignal<boolean>;
} {
  const activatedRoute = inject(ActivatedRoute);
  const router = inject(Router);

  let subscription: Subscription | undefined;
  inject(DestroyRef).onDestroy(() => {
    subscription?.unsubscribe();
  });

  effect(() => {
    const _paginator = paginator();
    const _sort = sort();

    subscription?.unsubscribe();

    subscription = merge(_paginator.page, _sort.sortChange).subscribe(() => {
      const queryParams = {
        size: _paginator.pageSize,
        page: _paginator.pageIndex,
        sort: _sort.active,
        direction: _sort.direction,
      };
      lumber.log('updatePaginationParams', 'new params', queryParams);
      void router.navigate([], {
        relativeTo: activatedRoute,
        queryParamsHandling: 'merge',
        queryParams,
      });
    });
  });

  const loading = signal(true);
  const totalElements = signal<number>(0);

  const params: Signal<PageableDto> = toSignal(
    activatedRoute.queryParamMap.pipe(
      map((it) => ({
        page: it.get('page') ? n_from(it.get('page')) : 0,
        size: it.get('size') ? n_from(it.get('size')) : (defaultPageSize ?? DEFAULT_PAGE_SIZE),
        sort: {
          name: it.get('sort') ?? defaultSortBy,
          direction: (it.get('direction') as SortDirection | undefined) ?? defaultSortDirection ?? DEFAULT_SORT_DIRECTION,
        },
      })),
    ),
    {
      initialValue: {
        page: 0,
        size: defaultPageSize ?? DEFAULT_PAGE_SIZE,
        sort: {
          name: defaultSortBy,
          direction: defaultSortDirection ?? DEFAULT_SORT_DIRECTION,
        },
      },
    },
  );

  return {
    params,
    loading,
    totalElements,
  };
}
