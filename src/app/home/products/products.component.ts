import {CdkDrag, CdkDragHandle, CdkDropList} from '@angular/cdk/drag-drop';
import {LowerCasePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, effect, inject, signal, viewChild} from '@angular/core';
import {toObservable} from '@angular/core/rxjs-interop';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {ActionDropdownComponent} from '@home-shared/components/action-dropdown.component';
import {AppResetOrderButtonComponent} from '@home-shared/components/button/app-reset-order-button.component';
import {AppOrderModeSwitchComponent} from '@home-shared/form/app-order-mode-switch.component';
import {
  addGroupIfMissing,
  injectTable,
  injectTableDelete,
  injectTableFilter,
  injectTableOrder,
  injectTableSelect,
  listOrderStyles,
  removeGroup,
} from '@home-shared/list';
import {mapName} from '@home-shared/name-map';
import {TranslocoPipe} from '@jsverse/transloco';

import {NgbDropdownModule, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';
import {GetProductMaxResponse} from '@shared/waiterrobot-backend';
import {n_from} from 'dfts-helper';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule, NgbSort} from 'dfx-bootstrap-table';
import {DfxArrayPluck, DfxCurrencyCentPipe, DfxImplodePipe, StopPropagationDirective} from 'dfx-helper';
import {injectParams} from 'ngxtension/inject-params';
import {forkJoin, switchMap} from 'rxjs';
import {AppTextWithColorIndicatorComponent} from '../_shared/components/color/app-text-with-color-indicator.component';
import {ScrollableToolbarComponent} from '../_shared/components/scrollable-toolbar.component';
import {AppSoldOutPipe} from '../_shared/pipes/app-sold-out.pipe';
import {ProductsService} from './_services/products.service';

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      <scrollable-toolbar>
        <div>
          <a routerLink="../p/create" class="btn btn-sm btn-success" [queryParams]="{group: activeId() !== 'all' ? activeId() : null}">
            <bi name="plus-circle" />
            {{ 'ADD_2' | transloco }}</a
          >
        </div>

        <div [ngbTooltip]="!selection.hasValue() ? ('HOME_PROD_SELECT_INFO' | transloco) : undefined">
          <button type="button" class="btn btn-sm btn-danger" [disabled]="!selection.hasValue()" (mousedown)="delete.onDeleteSelected()">
            <bi name="trash" />
            {{ 'DELETE' | transloco }}
          </button>
        </div>

        <div ngbDropdown container="body">
          <button
            type="button"
            class="btn btn-sm btn-secondary"
            id="toggleSoldOutDropdown"
            ngbDropdownToggle
            [disabled]="setSoldOutLoading() || !selection.hasValue()"
            [class.btnSpinner]="setSoldOutLoading()"
          >
            <bi name="cart" />
            {{ 'HOME_PROD_AVAILABLE' | transloco }}
          </button>
          <div ngbDropdownMenu aria-labelledby="toggleSoldOutDropdown">
            <button type="button" ngbDropdownItem (click)="toggleProductsSoldOut(false)">
              {{ false | soldOut }}
              {{ 'ACTIVATE' | transloco }}
            </button>
            <button type="button" ngbDropdownItem (click)="toggleProductsSoldOut(true)">
              {{ true | soldOut }}
              {{ 'HOME_PROD_SOLD_OUT' | transloco }}
            </button>
          </div>
        </div>

        @if (activeId() !== 'all') {
          <a class="btn btn-sm btn-primary" [routerLink]="'../../product-groups/' + activeId()">
            <bi name="pencil-square" />
            {{ 'HOME_PROD_GROUP' | transloco }} {{ 'EDIT' | transloco | lowercase }}</a
          >
        }

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

        @if (activeId() !== 'all') {
          <app-order-mode-switch [orderMode]="order.isOrdering()" (orderModeChange)="order.setIsOrdering($event)" />

          <app-reset-order-button
            [isOrdering]="order.isOrdering()"
            [disabled]="!order.hasCustomPositionSet()"
            (resetOrder)="order.resetOrder()"
          />
        }
      </scrollable-toolbar>

      <form>
        <div class="input-group">
          <input class="form-control ml-2" type="text" [formControl]="filter.control" [placeholder]="'SEARCH' | transloco" />
          @if (filter.isActive()) {
            <button
              class="btn btn-outline-secondary"
              type="button"
              placement="bottom"
              [ngbTooltip]="'CLEAR' | transloco"
              (mousedown)="filter.reset()"
            >
              <bi name="x-circle-fill" />
            </button>
          }
        </div>
      </form>

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
              <th *ngbHeaderCellDef ngb-header-cell>
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

            <ng-container ngbColumnDef="group">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_PROD_GROUP_PRODUCTS_VIEW' | transloco }}</th>
              <td *ngbCellDef="let product" ngb-cell>
                <app-text-with-color-indicator [color]="product.group.color">
                  {{ product.group.name }}
                </app-text-with-color-indicator>
              </td>
            </ng-container>

            <ng-container ngbColumnDef="position">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header style="width: 20px">{{ 'POSITION' | transloco }}</th>
              <td *ngbCellDef="let product" ngb-cell>{{ product.position ?? '' }}</td>
            </ng-container>

            <ng-container ngbColumnDef="name">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAME' | transloco }}</th>
              <td *ngbCellDef="let product" ngb-cell>{{ product.name }}</td>
            </ng-container>

            <ng-container ngbColumnDef="price">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'PRICE' | transloco }}</th>
              <td *ngbCellDef="let product" ngb-cell>{{ product.price | currency }}</td>
            </ng-container>

            <ng-container ngbColumnDef="soldOut">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_PROD_AVAILABLE' | transloco }}</th>
              <td *ngbCellDef="let product" ngb-cell>{{ product.soldOut | soldOut }}</td>
            </ng-container>

            <ng-container ngbColumnDef="initialStock">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_PROD_AMOUNT_LEFT' | transloco }}</th>
              <td *ngbCellDef="let product" ngb-cell>
                @if (product.initialStock) {
                  <span>
                    {{ product.initialStock - product.amountOrdered }}
                  </span>
                }
              </td>
            </ng-container>

            <ng-container ngbColumnDef="printer">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAV_PRINTERS' | transloco }}</th>
              <td *ngbCellDef="let product" ngb-cell>{{ product.printer.name }}</td>
            </ng-container>

            <ng-container ngbColumnDef="allergens">
              <th *ngbHeaderCellDef ngb-header-cell>{{ 'HOME_PROD_ALLERGENS' | transloco }}</th>
              <td *ngbCellDef="let product" ngb-cell>{{ product.allergens | a_pluck: 'shortName' | s_implode: ', ' }}</td>
            </ng-container>

            <ng-container ngbColumnDef="actions">
              <th *ngbHeaderCellDef ngb-header-cell>
                <span class="visually-hidden">{{ 'ACTIONS' | transloco }}</span>
              </th>
              <td *ngbCellDef="let product" ngb-cell>
                <app-action-dropdown>
                  <a
                    type="button"
                    class="d-flex gap-2 align-items-center"
                    ngbDropdownItem
                    routerLink="../../orders"
                    [queryParams]="{productIds: product.id}"
                  >
                    <bi name="stack" />
                    {{ 'NAV_ORDERS' | transloco }}
                  </a>
                  <a
                    type="button"
                    class="d-flex gap-2 align-items-center"
                    ngbDropdownItem
                    routerLink="../../bills"
                    [queryParams]="{productIds: product.id}"
                  >
                    <bi name="cash-coin" />
                    {{ 'NAV_BILLS' | transloco }}
                  </a>
                  <div class="dropdown-divider"></div>
                  <a type="button" class="d-flex gap-2 align-items-center" ngbDropdownItem (click)="toggleProductSoldOut(product)">
                    @if (product.soldOut) {
                      {{ false | soldOut }}
                      {{ 'ACTIVATE' | transloco }}
                    } @else {
                      {{ true | soldOut }}
                      {{ 'HOME_PROD_SOLD_OUT' | transloco }}
                    }
                  </a>
                  <a type="button" class="d-flex gap-2 align-items-center" ngbDropdownItem [routerLink]="'../p/' + product.id">
                    <bi name="pencil-square" />
                    {{ 'EDIT' | transloco }}
                  </a>
                  <button
                    type="button"
                    class="d-flex gap-2 align-items-center text-danger-emphasis"
                    ngbDropdownItem
                    (mousedown)="delete.onDelete(product.id)"
                  >
                    <bi name="trash" />
                    {{ 'DELETE' | transloco }}
                  </button>
                </app-action-dropdown>
              </td>
            </ng-container>

            <tr *ngbHeaderRowDef="table.columnsToDisplay()" ngb-header-row></tr>
            <tr
              *ngbRowDef="let product; columns: table.columnsToDisplay()"
              ngb-row
              cdkDrag
              [routerLink]="'../p/' + product.id"
              [cdkDragData]="product"
            ></tr>
          </table>
        </div>
      }

      <app-progress-bar [show]="table.isLoading()" />
    </div>
  `,
  styles: [listOrderStyles],
  selector: 'app-all-products',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    LowerCasePipe,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    DfxTableModule,
    DfxSortModule,
    DfxCurrencyCentPipe,
    DfxArrayPluck,
    DfxImplodePipe,
    TranslocoPipe,
    BiComponent,
    NgbTooltip,
    NgbDropdownModule,
    ScrollableToolbarComponent,
    AppSoldOutPipe,
    AppTextWithColorIndicatorComponent,
    AppProgressBarComponent,
    ActionDropdownComponent,
    StopPropagationDirective,
    AppOrderModeSwitchComponent,
    AppResetOrderButtonComponent,
  ],
})
export class ProductsComponent {
  #productsService = inject(ProductsService);

  setSoldOutLoading = signal(false);

  activeId = injectParams('id');
  #activeId$ = toObservable(this.activeId);

  sort = viewChild(NgbSort);
  filter = injectTableFilter();
  table = injectTable({
    columnsToDisplay: ['group', 'position', 'name', 'price', 'soldOut', 'initialStock', 'printer', 'allergens', 'actions'],
    fetchData: (setLoading) =>
      this.#activeId$.pipe(
        switchMap((activeId) => {
          setLoading();
          this.selection.clear();
          this.order.setIsOrdering(false);

          if (activeId === 'all') {
            this.table.columnsToDisplay.update((it) => addGroupIfMissing(it));
            return this.#productsService.getAll$();
          }
          this.table.columnsToDisplay.update((it) => removeGroup(it));
          return this.#productsService.getByParent$(n_from(activeId));
        }),
      ),
    sort: this.sort,
    filterValue$: this.filter.value$,
    sortingDataAccessors: {
      name: (it) => it.name.toLocaleLowerCase(),
      group: (it) => it.group.name.toLocaleLowerCase(),
      printer: (it) => it.printer.name,
    },
  });

  selection = injectTableSelect({
    dataSource: this.table.dataSource,
    columnsToDisplay: this.table.columnsToDisplay,
  });

  delete = injectTableDelete({
    delete$: (id) => this.#productsService.delete$(id),
    selection: this.selection.selection,
    nameMap: mapName(),
  });

  order = injectTableOrder({
    dataSource: this.table.dataSource,
    order$: (it) => this.#productsService.order$(n_from(this.activeId()), it),
    getPosition: (it) => it.position,
    onOrderingChange: (isOrdering) => {
      if (isOrdering) {
        this.selection.clear();
      }
    },
  });

  constructor() {
    effect(
      () => {
        if (!this.table.isLoading()) {
          this.setSoldOutLoading.set(false);
        }
      },
      {allowSignalWrites: true},
    );
  }

  toggleProductSoldOut(dto: GetProductMaxResponse): void {
    this.table.isLoading.set(true);
    this.setSoldOutLoading.set(true);
    this.#productsService.toggleSoldOut$(dto).subscribe();
  }

  toggleProductsSoldOut(soldOut: boolean) {
    this.table.isLoading.set(true);
    this.setSoldOutLoading.set(true);
    forkJoin(this.selection.selection().selected.map((it) => this.#productsService.toggleSoldOut$(it, soldOut))).subscribe();
  }
}
