import {CdkDrag, CdkDragHandle, CdkDropList} from '@angular/cdk/drag-drop';
import {ChangeDetectionStrategy, Component, inject, viewChild} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

import {TranslocoPipe} from '@jsverse/transloco';
import {NgbDropdownItem, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule, NgbSort} from 'dfx-bootstrap-table';
import {StopPropagationDirective} from 'dfx-helper';

import {ActionDropdownComponent} from '../../components/action-dropdown.component';
import {BlankslateComponent} from '../../components/blankslate.component';
import {AppResetOrderButtonComponent} from '../../components/button/app-reset-order-button.component';
import {AppTextWithColorIndicatorComponent} from '../../components/color/app-text-with-color-indicator.component';
import {AppProgressBarComponent} from '../../components/loading/app-progress-bar.component';
import {ScrollableToolbarComponent} from '../../components/scrollable-toolbar.component';
import {AppOrderModeSwitchComponent} from '../../forms/form/app-order-mode-switch.component';
import {ListFilterComponent, injectTable, injectTableDelete, injectTableFilter, injectTableOrder, injectTableSelect} from '../../util/list';
import {listOrderStyles} from '../../util/list/list-order-styles';
import {mapName} from '../../util/name-map';
import {TableGroupsService} from './_services/table-groups.service';

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      <h1 class="my-0">{{ 'HOME_TABLE_GROUPS' | transloco }}</h1>

      <scrollable-toolbar>
        <div>
          <a class="btn btn-sm btn-success" routerLink="../create">
            <bi name="plus-circle" />
            {{ 'ADD_2' | transloco }}</a
          >
        </div>
        <div [ngbTooltip]="!selection.hasValue() ? ('HOME_TABLE_GROUP_SELECT_INFO' | transloco) : undefined">
          <button
            class="btn btn-sm btn-danger"
            [class.disabled]="!selection.hasValue()"
            (mousedown)="delete.onDeleteSelected()"
            type="button"
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
            [hover]="true"
            [dataSource]="dataSource"
            [ngbSortDisabled]="order.isOrdering()"
            [cdkDropListData]="dataSource.data"
            [cdkDropListDisabled]="!order.isOrdering()"
            (cdkDropListDropped)="order.drop($event)"
            ngb-table
            ngb-sort
            cdkDropList
            cdkDropListLockAxis="y"
          >
            <ng-container ngbColumnDef="select">
              <th *ngbHeaderCellDef ngb-header-cell style="width: 25px">
                @if (!order.isOrdering()) {
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      [checked]="selection.isAllSelected()"
                      (change)="selection.toggleAll()"
                      type="checkbox"
                      name="checked"
                    />
                  </div>
                }
              </th>
              <td *ngbCellDef="let selectable" ngb-cell stopPropagation>
                @if (order.isOrdering()) {
                  <button class="btn btn-sm btn-outline-primary text-body-emphasis" type="button" cdkDragHandle>
                    <bi name="grip-vertical" />
                  </button>
                } @else {
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      [checked]="selection.isSelected(selectable)"
                      (change)="selection.toggle(selectable, !selection.isSelected(selectable))"
                      type="checkbox"
                      name="checked"
                    />
                  </div>
                }
              </td>
            </ng-container>

            <ng-container ngbColumnDef="position">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header style="width: 20px">
                {{ 'POSITION' | transloco }}
              </th>
              <td *ngbCellDef="let tableGroup" ngb-cell>
                {{ tableGroup.position ?? '' }}
              </td>
            </ng-container>

            <ng-container ngbColumnDef="name">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>
                {{ 'NAME' | transloco }}
              </th>
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
                    class="d-flex gap-2 align-items-center"
                    [queryParams]="{tableGroupIds: tableGroup.id}"
                    type="button"
                    ngbDropdownItem
                    routerLink="../../orders"
                  >
                    <bi name="stack" />
                    {{ 'NAV_ORDERS' | transloco }}
                  </a>
                  <a
                    class="d-flex gap-2 align-items-center"
                    [queryParams]="{tableGroupIds: tableGroup.id}"
                    type="button"
                    ngbDropdownItem
                    routerLink="../../bills"
                  >
                    <bi name="cash-coin" />
                    {{ 'NAV_BILLS' | transloco }}
                  </a>
                  <div class="dropdown-divider"></div>
                  <a class="d-flex gap-2 align-items-center" [routerLink]="'../' + tableGroup.id" type="button" ngbDropdownItem>
                    <bi name="pencil-square" />
                    {{ 'EDIT' | transloco }}
                  </a>
                  <button
                    class="d-flex gap-2 align-items-center text-danger-emphasis"
                    (mousedown)="delete.onDelete(tableGroup.id)"
                    type="button"
                    ngbDropdownItem
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
              [cdkDragData]="tableGroup"
              [routerLink]="'../' + tableGroup.id"
              ngb-row
              cdkDrag
            ></tr>
          </table>
        </div>
      }

      @if (table.isEmpty()) {
        <app-blankslate [header]="'HOME_TABLE_GROUPS' | transloco" [description]="'HOME_TABLES_EMPTY' | transloco" icon="columns-gap">
          <a class="btn btn-success" type="button" routerLink="../create">
            <bi name="plus-circle" />
            {{ 'ADD_2' | transloco }}
          </a>
          <a href="https://help.kellner.team/table.html" target="_blank">Erfahre mehr</a>
        </app-blankslate>
      }

      <app-progress-bar [show]="table.isLoading()" />
    </div>
  `,
  styles: [listOrderStyles],
  selector: 'app-table-groups',
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
    BlankslateComponent,
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
