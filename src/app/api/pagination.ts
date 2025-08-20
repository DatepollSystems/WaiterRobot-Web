import {DestroyRef, Signal, computed, effect, inject, signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {ActivatedRoute, Router} from '@angular/router';

import {Subscription, map, merge, of} from 'rxjs';

import {loggerOf, n_from} from 'dfts-helper';
import {NgbPaginator, NgbSort, SortDirection} from 'dfx-bootstrap-table';

export interface PageableDto {
  page: number;
  size: number;
  sort: string[];
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
  sort?: Signal<NgbSort>;
}) {
  const activatedRoute = inject(ActivatedRoute);
  const router = inject(Router);

  let subscription: Subscription | undefined;
  inject(DestroyRef).onDestroy(() => {
    subscription?.unsubscribe();
  });

  effect(() => {
    const _paginator = paginator();
    const _sort = sort ? sort() : undefined;

    subscription?.unsubscribe();

    subscription = merge(_paginator.page as any, _sort?.sortChange ?? (of(undefined) as any)).subscribe({
      next: () => {
        const queryParams = {
          size: _paginator.pageSize,
          page: _paginator.pageIndex,
          sort: _sort?.active,
          direction: _sort?.direction,
        };
        lumber.log('updatePaginationParams', 'new params', queryParams);
        void router.navigate([], {
          relativeTo: activatedRoute,
          queryParamsHandling: 'merge',
          queryParams,
        });
      },
      complete: () => console.log('completed'),
    });
  });

  const loading = signal(true);
  const totalElements = signal<number>(0);

  const params: Signal<PageableDto> = toSignal(
    activatedRoute.queryParamMap.pipe(
      map((it) => {
        const sortName = it.get('sort') ?? defaultSortBy;
        const sortDirection = (it.get('direction') as SortDirection | undefined) ?? defaultSortDirection ?? DEFAULT_SORT_DIRECTION;
        return {
          page: it.get('page') ? n_from(it.get('page')) : 0,
          size: it.get('size') ? n_from(it.get('size')) : (defaultPageSize ?? DEFAULT_PAGE_SIZE),
          sort: [`${sortName},${sortDirection}`],
        };
      }),
    ),
    {
      initialValue: {
        page: 0,
        size: defaultPageSize ?? DEFAULT_PAGE_SIZE,
        sort: [`${defaultSortBy},${defaultSortDirection ?? DEFAULT_SORT_DIRECTION}`],
      },
    },
  );

  const sortParams = computed(() => {
    const _params = params().sort[0]!.split(',');

    return {
      name: _params[0]!,
      direction: _params[1] as SortDirection,
    };
  });

  return {
    params,
    sortParams,
    loading,
    totalElements,
  };
}
