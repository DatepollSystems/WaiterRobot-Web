import {CdkDrag, CdkDragHandle, CdkDropList} from '@angular/cdk/drag-drop';
import {ChangeDetectionStrategy, Component, inject, viewChild} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {ActionDropdownComponent} from '@home-shared/components/action-dropdown.component';
import {AppResetOrderButtonComponent} from '@home-shared/components/button/app-reset-order-button.component';
import {injectTable, injectTableDelete, injectTableFilter, injectTableOrder, injectTableSelect} from '@home-shared/list';
import {listOrderStyles} from '@home-shared/list/list-order-styles';
import {mapName} from '@home-shared/name-map';
import {TranslocoPipe} from '@jsverse/transloco';

import {NgbDropdownItem, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule, NgbSort} from 'dfx-bootstrap-table';
import {StopPropagationDirective} from 'dfx-helper';
import {AppTextWithColorIndicatorComponent} from '../_shared/components/color/app-text-with-color-indicator.component';
import {ScrollableToolbarComponent} from '../_shared/components/scrollable-toolbar.component';
import {AppOrderModeSwitchComponent} from '../_shared/form/app-order-mode-switch.component';
import {ProductGroupsService} from './_services/product-groups.service';

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      <h1 class="my-0">{{ 'HOME_PROD_GROUPS' | transloco }}</h1>

      <scrollable-toolbar>
        <div>
          <a routerLink="../create" class="btn btn-sm btn-success">
            <bi name="plus-circle" />
            {{ 'ADD_2' | transloco }}</a
          >
        </div>
        <div [ngbTooltip]="!selection.hasValue() ? ('HOME_PROD_SELECT_INFO' | transloco) : undefined">
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

        <div class="input-group action-search">
          <input class="form-control form-control-sm" type="text" [formControl]="filter.control" [placeholder]="'SEARCH' | transloco" />
          @if (filter.isActive()) {
            <button
              class="btn btn-outline-secondary"
              type="button"
              placement="bottom"
              [ngbTooltip]="'CLEAR' | transloco"
              (click)="filter.reset()"
            >
              <bi name="x-circle-fill" />
            </button>
          }
        </div>

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
            [dataSource]="order.orderDataSource() ?? dataSource"
            [ngbSortDisabled]="order.isOrdering()"
            [cdkDropListData]="dataSource.data"
            [cdkDropListDisabled]="!order.isOrdering()"
            (cdkDropListDropped)="order.drop($event)"
          >
            <ng-container ngbColumnDef="select">
              <th *ngbHeaderCellDef ngb-header-cell style="width: 20px">
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
                      (change)="selection.toggle(selectable, $event)"
                    />
                  </div>
                }
              </td>
            </ng-container>

            <ng-container ngbColumnDef="position">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header style="width: 20px">{{ 'POSITION' | transloco }}</th>
              <td *ngbCellDef="let productGroup" ngb-cell>
                {{ productGroup.position ?? '' }}
              </td>
            </ng-container>

            <ng-container ngbColumnDef="name">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAME' | transloco }}</th>
              <td *ngbCellDef="let productGroup" ngb-cell>
                <app-text-with-color-indicator [color]="productGroup.color">
                  {{ productGroup.name }}
                </app-text-with-color-indicator>
              </td>
            </ng-container>

            <ng-container ngbColumnDef="actions">
              <th *ngbHeaderCellDef ngb-header-cell>
                <span class="visually-hidden">{{ 'ACTIONS' | transloco }}</span>
              </th>
              <td *ngbCellDef="let productGroup" ngb-cell>
                <app-action-dropdown>
                  <a
                    type="button"
                    class="d-flex gap-2 align-items-center"
                    ngbDropdownItem
                    routerLink="../../orders"
                    [queryParams]="{productGroupIds: productGroup.id}"
                  >
                    <bi name="stack" />
                    {{ 'NAV_ORDERS' | transloco }}
                  </a>
                  <a
                    type="button"
                    class="d-flex gap-2 align-items-center"
                    ngbDropdownItem
                    routerLink="../../bills"
                    [queryParams]="{productGroupIds: productGroup.id}"
                  >
                    <bi name="cash-coin" />
                    {{ 'NAV_BILLS' | transloco }}
                  </a>
                  <div class="dropdown-divider"></div>
                  <a type="button" class="d-flex gap-2 align-items-center" ngbDropdownItem [routerLink]="'../' + productGroup.id">
                    <bi name="pencil-square" />
                    {{ 'EDIT' | transloco }}
                  </a>
                  <button
                    type="button"
                    class="d-flex gap-2 align-items-center text-danger-emphasis"
                    ngbDropdownItem
                    (mousedown)="delete.onDelete(productGroup.id)"
                  >
                    <bi name="trash" />
                    {{ 'DELETE' | transloco }}
                  </button>
                </app-action-dropdown>
              </td>
            </ng-container>

            <tr *ngbHeaderRowDef="table.columnsToDisplay()" ngb-header-row></tr>
            <tr
              *ngbRowDef="let productGroup; columns: table.columnsToDisplay()"
              ngb-row
              cdkDrag
              [cdkDragData]="productGroup"
              [routerLink]="'../' + productGroup.id"
            ></tr>
          </table>
        </div>
      }

      <app-progress-bar [show]="table.isLoading()" />
    </div>
  `,
  styles: [listOrderStyles],
  selector: 'app-product-groups',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    TranslocoPipe,
    DfxTableModule,
    DfxSortModule,
    NgbTooltip,
    ScrollableToolbarComponent,
    BiComponent,
    AppTextWithColorIndicatorComponent,
    AppOrderModeSwitchComponent,
    AppProgressBarComponent,
    ActionDropdownComponent,
    NgbDropdownItem,
    StopPropagationDirective,
    AppResetOrderButtonComponent,
  ],
})
export class ProductGroupsComponent {
  #productGroupsService = inject(ProductGroupsService);

  sort = viewChild(NgbSort);
  filter = injectTableFilter();
  table = injectTable({
    sort: this.sort,
    columnsToDisplay: ['position', 'name', 'actions'],
    fetchData: () => this.#productGroupsService.getAll$(),
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
    delete$: (id) => this.#productGroupsService.delete$(id),
    selection: this.selection.selection,
    nameMap: mapName(),
  });

  order = injectTableOrder({
    dataSource: this.table.dataSource,
    order$: (it) => this.#productGroupsService.order$(it),
    getPosition: (it) => it.position,
    onOrderingChange: (isOrdering) => {
      if (isOrdering) {
        this.selection.clear();
      }
    },
  });
}
