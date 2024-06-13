import {HttpErrorResponse} from '@angular/common/http';
import {computed, effect, inject, Signal, signal, WritableSignal} from '@angular/core';
import {Router} from '@angular/router';
import {NgbPaginator, NgbSort, NgbTableDataSource} from 'dfx-bootstrap-table';
import {derivedFrom} from 'ngxtension/derived-from';
import {catchError, debounceTime, Observable, of, pipe, switchMap} from 'rxjs';

type SortingDataAccessorsMap<EntityType> = (it: EntityType) => string | number;
type SortingDataAccessors<EntityType> = Record<string, SortingDataAccessorsMap<EntityType>>;

export function injectTable<EntityType>({
  fetchData,
  columnsToDisplay,
  filterValue$,
  sortingDataAccessors,
  redirectOnError,
  sort,
  paginator,
}: {
  fetchData: (setLoading: () => void) => Observable<EntityType[]>;
  columnsToDisplay: string[] | WritableSignal<string[]>;
  filterValue$?: Observable<string>;
  sortingDataAccessors?: SortingDataAccessors<EntityType>;
  redirectOnError?: boolean;
  sort?: Signal<NgbSort | undefined>;
  paginator?: Signal<NgbPaginator | undefined>;
}) {
  const router = inject(Router);

  const signalSort = sort ?? signal(undefined);
  const signalPaginator = paginator ?? signal(undefined);

  const isLoading = signal(true);
  const setLoading = () => {
    isLoading.set(true);
    dataSource.set(new NgbTableDataSource<EntityType>());
  };
  const error = signal<unknown>(undefined);

  const dataSource = signal(new NgbTableDataSource<EntityType>());

  const signalDataSource: Signal<NgbTableDataSource<EntityType>> = derivedFrom(
    [
      signalSort,
      signalPaginator,
      (filterValue$ ?? of('')).pipe(debounceTime(250)),
      fetchData(setLoading).pipe(
        catchError((_error: unknown) => {
          if ((redirectOnError ?? true) && _error instanceof HttpErrorResponse && _error.status === 404) {
            void router.navigateByUrl('/not-found');
          }
          error.set(_error);
          return of([]);
        }),
      ),
    ],
    pipe(
      switchMap(([_sort, _paginator, _filter, data]) => {
        const _dataSource = new NgbTableDataSource<EntityType>(data);

        if (sortingDataAccessors) {
          _dataSource.sortingDataAccessor = (item, property) => {
            const fun = sortingDataAccessors[property] as SortingDataAccessorsMap<EntityType> | undefined;
            if (!fun) {
              return item[property as keyof EntityType] as string | number;
            }
            return fun(item);
          };
        }
        if (_sort) {
          _dataSource.sort = _sort;
        }
        if (_paginator) {
          _dataSource.paginator = _paginator;
        }
        _dataSource.filter = _filter;

        isLoading.set(false);

        return of(_dataSource);
      }),
    ),
    {initialValue: new NgbTableDataSource<EntityType>()},
  );

  effect(
    () => {
      dataSource.set(signalDataSource());
    },
    {
      allowSignalWrites: true,
    },
  );

  const isEmpty = computed(() => {
    const _dataSource = dataSource();
    const _isLoading = isLoading();

    if (!_isLoading) {
      return _dataSource.data.length === 0;
    }
    return false;
  });

  const _columnsToDisplay = Array.isArray(columnsToDisplay) ? signal(columnsToDisplay) : columnsToDisplay;

  return {
    columnsToDisplay: _columnsToDisplay,
    isLoading: isLoading,
    error: error.asReadonly(),
    isEmpty,
    dataSource,
  };
}
