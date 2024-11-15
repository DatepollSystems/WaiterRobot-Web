import {computed} from '@angular/core';

import {tap} from 'rxjs';

import {patchState, signalStoreFeature, withComputed, withMethods, withState} from '@ngrx/signals';
import {withEntities} from '@ngrx/signals/entities';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {NgbPaginator, NgbSort, NgbTableDataSource} from 'dfx-bootstrap-table';

import {withRequestStatus} from '@shared/api/request-status.feature';

export type TableState = {
  columnsToDisplay: string[];
  sort: NgbSort | undefined;
  paginator: NgbPaginator | undefined;
  filter: string | undefined;
};

type SortingDataAccessorsMap<EntityType> = (it: EntityType) => string | number;
type SortingDataAccessors<EntityType> = Record<string, SortingDataAccessorsMap<EntityType>>;

export function withTable<EntityType>({
  columnsToDisplay,
  sortingDataAccessors,
}: {
  columnsToDisplay: string[];
  sortingDataAccessors?: SortingDataAccessors<EntityType>;
}) {
  return signalStoreFeature(
    withEntities<EntityType>(),
    withRequestStatus(),
    withState<TableState>({
      columnsToDisplay,
      sort: undefined,
      paginator: undefined,
      filter: undefined,
    }),
    withMethods((store) => ({
      setFilter: rxMethod<string | undefined>(tap((filter) => patchState(store, () => ({filter})))),
      setPaginator: rxMethod<NgbPaginator | undefined>(tap((paginator) => patchState(store, () => ({paginator})))),
      setSort: rxMethod<NgbSort | undefined>(tap((sort) => patchState(store, () => ({sort})))),
    })),
    withComputed((store) => ({
      dataSource: computed(() => {
        const _dataSource = new NgbTableDataSource<EntityType>(store.entities());

        if (sortingDataAccessors) {
          _dataSource.sortingDataAccessor = (item, property) => {
            const fun = sortingDataAccessors[property] as SortingDataAccessorsMap<EntityType> | undefined;
            if (!fun) {
              return item[property as keyof EntityType] as string | number;
            }
            return fun(item);
          };
        }
        const _sort = store.sort();
        if (_sort) {
          _dataSource.sort = _sort;
        }
        const _paginator = store.paginator();
        if (_paginator) {
          _dataSource.paginator = _paginator;
        }

        const _filter = store.filter();
        if (_filter) {
          _dataSource.filter = _filter;
        }

        return _dataSource;
      }),
      isEmpty: computed(() => store.isFulfilled() && store.entities().length === 0),
    })),
  );
}
