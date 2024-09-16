import {CdkDrag, CdkDragHandle, CdkDropList} from '@angular/cdk/drag-drop';
import {ChangeDetectionStrategy, Component, inject, viewChild} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {ActionDropdownComponent} from '@home-shared/components/action-dropdown.component';
import {AppResetOrderButtonComponent} from '@home-shared/components/button/app-reset-order-button.component';

import {AppTextWithColorIndicatorComponent} from '@home-shared/components/color/app-text-with-color-indicator.component';
import {ScrollableToolbarComponent} from '@home-shared/components/scrollable-toolbar.component';
import {AppOrderModeSwitchComponent} from '@home-shared/form/app-order-mode-switch.component';
import {
  injectTable,
  injectTableDelete,
  injectTableFilter,
  injectTableOrder,
  injectTableSelect,
  ListFilterComponent,
} from '@home-shared/list';
import {listOrderStyles} from '@home-shared/list/list-order-styles';
import {mapName} from '@home-shared/name-map';
import {TranslocoPipe} from '@jsverse/transloco';
import {NgbDropdownItem, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule, NgbSort} from 'dfx-bootstrap-table';
import {StopPropagationDirective} from 'dfx-helper';

import {TableGroupsService} from './_services/table-groups.service';

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      <h1 class="my-0">{{ 'HOME_TABLE_GROUPS' | transloco }}</h1>

      <scrollable-toolbar>
        <div>
          <a routerLink="../create" class="btn btn-sm btn-success">
            <bi name="plus-circle" />
            {{ 'ADD_2' | transloco }}</a
          >
        </div>
        <div [ngbTooltip]="!selection.hasValue() ? ('HOME_TABLE_GROUP_SELECT_INFO' | transloco) : undefined">
          <button
            type="button"
            class="btn btn-sm btn-danger"
            [class.disabled]="!selection.hasValue()"
            (mousedown)="delete.onDeleteSelected()"
          >
            <bi name="trash" />
            {{ 'DELETE' | transloco }}
          </button>
        </div>

        <app-list-filter [filter]="filter" />

        <app-order-mode-switch [orderMode]="order.isOrdering()" (orderModeChange)="order.setIsOrdering($event)" />

        <app-reset-order-button
          [isOrdering]="order.isOrdering()"
          [disabled]="!order.hasCustomPositionSet()"
          (resetOrder)="order.resetOrder()"
        />
      </scrollable-toolbar>

      @if (table.dataSource(); as dataSource) {
        <div class="table-responsive">
          <table
            ngb-table
            ngb-sort
            cdkDropList
            cdkDropListLockAxis="y"
            [hover]="true"
            [dataSource]="dataSource"
            [ngbSortDisabled]="order.isOrdering()"
            [cdkDropListData]="dataSource.data"
            [cdkDropListDisabled]="!order.isOrdering()"
            (cdkDropListDropped)="order.drop($event)"
          >
            <ng-container ngbColumnDef="select">
              <th *ngbHeaderCellDef ngb-header-cell style="width: 25px">
                @if (!order.isOrdering()) {
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      name="checked"
                      [checked]="selection.isAllSelected()"
                      (change)="selection.toggleAll()"
                    />
                  </div>
                }
              </th>
              <td *ngbCellDef="let selectable" ngb-cell stopPropagation>
                @if (order.isOrdering()) {
                  <button type="button" class="btn btn-sm btn-outline-primary text-body-emphasis" cdkDragHandle>
                    <bi name="grip-vertical" />
                  </button>
                } @else {
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      name="checked"
                      [checked]="selection.isSelected(selectable)"
                      (change)="selection.toggle(selectable, !selection.isSelected(selectable))"
                    />
                  </div>
                }
              </td>
            </ng-container>

            <ng-container ngbColumnDef="position">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header style="width: 20px">{{ 'POSITION' | transloco }}</th>
              <td *ngbCellDef="let tableGroup" ngb-cell>
                {{ tableGroup.position ?? '' }}
              </td>
            </ng-container>

            <ng-container ngbColumnDef="name">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAME' | transloco }}</th>
              <td *ngbCellDef="let tableGroup" ngb-cell>
                <app-text-with-color-indicator [color]="tableGroup.color">
                  {{ tableGroup.name }}
                </app-text-with-color-indicator>
              </td>
            </ng-container>

            <ng-container ngbColumnDef="actions">
              <th *ngbHeaderCellDef ngb-header-cell>
                <span class="visually-hidden">{{ 'ACTIONS' | transloco }}</span>
              </th>
              <td *ngbCellDef="let tableGroup" ngb-cell>
                <app-action-dropdown>
                  <a
                    type="button"
                    class="d-flex gap-2 align-items-center"
                    ngbDropdownItem
                    routerLink="../../orders"
                    [queryParams]="{tableGroupIds: tableGroup.id}"
                  >
                    <bi name="stack" />
                    {{ 'NAV_ORDERS' | transloco }}
                  </a>
                  <a
                    type="button"
                    class="d-flex gap-2 align-items-center"
                    ngbDropdownItem
                    routerLink="../../bills"
                    [queryParams]="{tableGroupIds: tableGroup.id}"
                  >
                    <bi name="cash-coin" />
                    {{ 'NAV_BILLS' | transloco }}
                  </a>
                  <div class="dropdown-divider"></div>
                  <a type="button" class="d-flex gap-2 align-items-center" ngbDropdownItem [routerLink]="'../' + tableGroup.id">
                    <bi name="pencil-square" />
                    {{ 'EDIT' | transloco }}
                  </a>
                  <button
                    type="button"
                    class="d-flex gap-2 align-items-center text-danger-emphasis"
                    ngbDropdownItem
                    (mousedown)="delete.onDelete(tableGroup.id)"
                  >
                    <bi name="trash" />
                    {{ 'DELETE' | transloco }}
                  </button>
                </app-action-dropdown>
              </td>
            </ng-container>

            <tr *ngbHeaderRowDef="table.columnsToDisplay()" ngb-header-row></tr>
            <tr
              *ngbRowDef="let tableGroup; columns: table.columnsToDisplay()"
              ngb-row
              cdkDrag
              [cdkDragData]="tableGroup"
              [routerLink]="'../' + tableGroup.id"
            ></tr>
          </table>
        </div>
      }

      <app-progress-bar [show]="table.isLoading()" />
    </div>
  `,
  styles: [listOrderStyles],
  selector: 'app-table-groups',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgbTooltip,
    CdkDrag,
    CdkDropList,
    CdkDragHandle,
    NgbDropdownItem,
    TranslocoPipe,
    DfxTableModule,
    DfxSortModule,
    BiComponent,
    ScrollableToolbarComponent,
    AppTextWithColorIndicatorComponent,
    AppOrderModeSwitchComponent,
    AppProgressBarComponent,
    ActionDropdownComponent,
    StopPropagationDirective,
    AppResetOrderButtonComponent,
    ListFilterComponent,
  ],
})
export class TableGroupsComponent {
  #tableGroupsService = inject(TableGroupsService);

  sort = viewChild(NgbSort);
  filter = injectTableFilter();
  table = injectTable({
    sort: this.sort,
    columnsToDisplay: ['position', 'name', 'actions'],
    fetchData: () => this.#tableGroupsService.getAll$(),
    filterValue$: this.filter.value$,
    sortingDataAccessors: {
      name: (it) => it.name.toLocaleLowerCase(),
    },
  });

  selection = injectTableSelect({
    dataSource: this.table.dataSource,
    columnsToDisplay: this.table.columnsToDisplay,
  });

  delete = injectTableDelete({
    delete$: (id) => this.#tableGroupsService.delete$(id),
    selection: this.selection.selection,
    nameMap: mapName(),
  });

  order = injectTableOrder({
    dataSource: this.table.dataSource,
    order$: (it) => this.#tableGroupsService.order$(it),
    getPosition: (it) => it.position,
    onOrderingChange: (isOrdering) => {
      if (isOrdering) {
        this.selection.clear();
      }
    },
  });
}
