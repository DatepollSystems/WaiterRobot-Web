import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {Component, Inject, signal} from '@angular/core';

import {HasOrdered} from '@shared/services/services.interface';

import {HasIDAndName} from 'dfts-helper';
import {HasDelete, HasGetAll} from 'dfx-helper';
import {AbstractModelsWithNameListWithDeleteComponent} from './abstract-models-with-name-list-with-delete.component';

export const AbstractModelsWithNameListWithDeleteAndOrderStyle = `
    .cdk-drag-preview {
      box-sizing: border-box;
      border-radius: 4px;
      box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
      0 8px 10px 1px rgba(0, 0, 0, 0.14),
      0 3px 14px 2px rgba(0, 0, 0, 0.12);
      display: table;
      color: white;
      background-color: var(--bs-body-bg);
      padding: 0 4px 0 4px;
    }

    .cdk-drag-preview td {
      flex-grow: 2;
      vertical-align: middle;
      padding: 8px;
      cursor: grabbing;
    }

    .cdk-drag-placeholder {
      background-color: var(--bs-tertiary-bg);
    }

    .cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }

    .cdk-drop-list-dragging .cdk-row:not(.cdk-drag-placeholder) {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
  `;

@Component({
  standalone: true,
  template: '',
  selector: 'abstract-models-with-name-list-with-delete-and-order',
})
export abstract class AbstractModelsWithNameListWithDeleteAndOrderComponent<
  EntityType extends HasIDAndName<EntityType['id']>,
> extends AbstractModelsWithNameListWithDeleteComponent<EntityType> {
  protected constructor(@Inject(null) protected entitiesService: HasGetAll<EntityType> & HasDelete<EntityType> & HasOrdered<EntityType>) {
    super(entitiesService);
  }

  orderMode = signal(false);

  setOrderMode(value: boolean): void {
    this.orderMode.set(value);
    if (value) {
      this.selection.clear();
      this.sort?.sort({id: '', start: 'asc', disableClear: false});
    } else {
      this.sort?.sort({id: 'name', start: 'desc', disableClear: false});
    }
  }

  drop(event: CdkDragDrop<EntityType[]>): void {
    const items = this._dataSource.data.slice();
    const previousIndex = items.findIndex((d) => d.id === event.item.data.id);

    moveItemInArray(items, previousIndex, event.currentIndex);

    this._dataSource.data = items;

    this.entitiesService
      .order$(
        items.map((it, i) => ({
          entityId: it.id,
          order: i,
        })),
      )
      .subscribe();
  }
}
