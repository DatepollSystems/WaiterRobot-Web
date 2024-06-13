import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {computed, signal, Signal} from '@angular/core';
import {IdResponse} from '@shared/waiterrobot-backend';
import {IHasID} from 'dfts-helper';
import {NgbTableDataSource} from 'dfx-bootstrap-table';
import {Observable} from 'rxjs';

interface EntityOrderDto<ID> {
  entityId: ID;
  order: number | null;
}

export function injectTableOrder<EntityType extends IHasID<EntityType['id']>>({
  onOrderingChange,
  dataSource,
  order$,
  getPosition,
}: {
  onOrderingChange: (isOrdering: boolean) => void;
  dataSource: Signal<NgbTableDataSource<EntityType>>;
  order$: (dto: EntityOrderDto<EntityType['id']>[]) => Observable<IdResponse[]>;
  getPosition?: (it: EntityType) => number | undefined;
}) {
  const isOrdering = signal(false);

  const setIsOrdering = (_isOrdering: boolean): void => {
    isOrdering.set(_isOrdering);
    onOrderingChange(_isOrdering);
  };

  const orderDataSource = signal<NgbTableDataSource<EntityType> | undefined>(undefined);

  const drop = (event: CdkDragDrop<EntityType[]>): void => {
    const _dataSource = dataSource();
    const items = _dataSource.data.slice();
    const previousIndex = items.findIndex((d) => d.id === event.item.data.id);

    moveItemInArray(items, previousIndex, event.currentIndex);

    _dataSource.data = items;

    orderDataSource.set(_dataSource);

    order$(
      items.map((it, i) => ({
        entityId: it.id,
        order: i,
      })),
    ).subscribe(() => {
      orderDataSource.set(undefined);
    });
  };

  const hasCustomPositionSet = computed(() => {
    const _dataSource = dataSource();

    if (!getPosition) {
      return false;
    }

    return _dataSource.data.some((it) => !!getPosition(it));
  });

  const resetOrder = () => {
    order$(dataSource().data.map((it) => ({entityId: it.id, order: null}))).subscribe();
  };

  return {
    isOrdering: isOrdering.asReadonly(),
    setIsOrdering,
    drop,
    resetOrder,
    orderDataSource: orderDataSource.asReadonly(),
    hasCustomPositionSet,
  };
}
