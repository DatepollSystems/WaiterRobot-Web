import {SelectionModel} from '@angular/cdk/collections';
import {computed, signal, Signal, WritableSignal} from '@angular/core';
import {IHasID} from 'dfts-helper';
import {NgbTableDataSource} from 'dfx-bootstrap-table';

function getSelectionModel<EntityType extends IHasID<EntityType['id']>>(selectedValues: EntityType[] = []): SelectionModel<EntityType> {
  return new SelectionModel<EntityType>(true, selectedValues, false, (o1, o2) => o1.id === o2.id);
}

export function injectTableSelect<EntityType extends IHasID<EntityType['id']>>({
  dataSource,
  columnsToDisplay,
  selectableFilter,
}: {
  dataSource: Signal<NgbTableDataSource<EntityType>>;
  columnsToDisplay: WritableSignal<string[]>;
  selectableFilter?: (it: EntityType) => boolean;
}) {
  const selection = signal(getSelectionModel<EntityType>());

  const hasValue = computed(() => selection().hasValue());
  const data = computed(() => {
    const _data = dataSource().data;
    if (selectableFilter) {
      return _data.filter(selectableFilter);
    }
    return _data;
  });

  /** Whether the number of selected elements matches the total number of rows. */
  const isAllSelected = computed(() => {
    if (!hasValue()) {
      return false;
    }
    const numSelected = selection().selected.length;
    const numRows = data().length;
    return numSelected === numRows;
  });

  columnsToDisplay.update((it) => ['select', ...it]);

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  const toggleAll = (): void => {
    const _selection = selection();
    if (isAllSelected()) {
      _selection.clear();
    } else {
      _selection.select(...data());
    }
    selection.set(getSelectionModel(_selection.selected));
  };

  const toggle = (it: EntityType, event: Event | undefined): void => {
    if (!event) {
      return;
    }
    const _selection = selection();
    _selection.toggle(it);
    selection.set(getSelectionModel(_selection.selected));
  };

  const clear = (): void => {
    selection.set(getSelectionModel());
  };

  return {
    toggleAll,
    toggle,
    isSelected: (it: EntityType) => selection().isSelected(it),
    hasValue,
    clear,
    isAllSelected,
    selection: selection.asReadonly(),
  };
}
