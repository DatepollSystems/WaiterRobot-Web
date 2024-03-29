import {CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {AsyncPipe, LowerCasePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {ActionDropdownComponent} from '@home-shared/components/action-dropdown.component';

import {NgbDropdownItem, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@ngneat/transloco';

import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';
import {AppSpinnerRowComponent} from '@shared/ui/loading/app-spinner-row.component';
import {GetProductGroupResponse, GetProductMaxResponse} from '@shared/waiterrobot-backend';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxArrayPluck, DfxCurrencyCentPipe, DfxImplodePipe} from 'dfx-helper';
import {AppTextWithColorIndicatorComponent} from '../_shared/components/color/app-text-with-color-indicator.component';
import {ScrollableToolbarComponent} from '../_shared/components/scrollable-toolbar.component';
import {AppOrderModeSwitchComponent} from '../_shared/form/app-order-mode-switch.component';
import {EntitiesHeaderWithPlaceholderLayout} from '../_shared/layouts/entities-header-with-placeholder.layout';
import {AbstractModelsWithNameListByIdComponent} from '../_shared/list/models-list-by-id/abstract-models-with-name-list-by-id.component';
import {AbstractModelsWithNameListWithDeleteAndOrderStyle} from '../_shared/list/models-list-with-delete/abstract-models-with-name-list-with-delete-and-order.component';
import {AppSoldOutPipe} from '../_shared/pipes/app-sold-out.pipe';
import {ProductGroupsService} from './_services/product-groups.service';
import {ProductsService} from './_services/products.service';

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      @if (entity$ | async; as entity) {
        <entities-header-with-placeholder-layout [loading]="entityLoading()">
          <app-text-with-color-indicator placement="right" [color]="entity.color" [size]="30">
            <h1 class="mb-0">{{ 'HOME_PROD_GROUP_PRODUCTS_VIEW' | transloco }} {{ entity.name }}</h1>
          </app-text-with-color-indicator>

          <scrollable-toolbar>
            <div>
              <a routerLink="../../../create" class="btn btn-sm btn-success" [queryParams]="{group: entity.id}">
                <bi name="plus-circle" />
                {{ 'HOME_PROD' | transloco }} {{ 'ADD_3' | transloco | lowercase }}</a
              >
            </div>
            <div>
              <a class="btn btn-sm btn-primary" [routerLink]="'../../' + entity.id">
                <bi name="pencil-square" />
                {{ 'HOME_PROD_GROUP' | transloco }} {{ 'EDIT' | transloco | lowercase }}</a
              >
            </div>

            <div [ngbTooltip]="!selection.hasValue() ? ('HOME_PROD_SELECT_INFO' | transloco) : undefined">
              <button type="button" class="btn btn-sm btn-danger" [class.disabled]="!selection.hasValue()" (click)="onDeleteSelected()">
                <bi name="trash" />
                {{ 'DELETE' | transloco }}
              </button>
            </div>

            <div class="d-flex align-items-center">
              <app-order-mode-switch [orderMode]="orderMode()" (orderModeChange)="setOrderMode($event)" />
            </div>
          </scrollable-toolbar>
        </entities-header-with-placeholder-layout>

        <form>
          <div class="input-group">
            <input class="form-control ml-2" type="text" [formControl]="filter" [placeholder]="'SEARCH' | transloco" />
            @if ((filter.value?.length ?? 0) > 0) {
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
        </form>

        @if (dataSource$ | async; as dataSource) {
          <div class="table-responsive">
            <table
              ngb-table
              ngb-sort
              ngbSortActive="name"
              ngbSortDirection="asc"
              cdkDropList
              cdkDropListLockAxis="y"
              [hover]="true"
              [dataSource]="isLoading() ? [] : dataSource"
              [ngbSortDisabled]="orderMode()"
              [cdkDropListData]="dataSource.data"
              [cdkDropListDisabled]="!orderMode()"
              (cdkDropListDropped)="drop(entity.id, $event)"
            >
              <ng-container ngbColumnDef="select">
                <th *ngbHeaderCellDef ngb-header-cell>
                  @if (!orderMode()) {
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        name="checked"
                        [checked]="selection.hasValue() && isAllSelected()"
                        (change)="$event ? toggleAllRows() : null"
                      />
                    </div>
                  }
                </th>
                <td *ngbCellDef="let selectable" ngb-cell (click)="$event.stopPropagation()">
                  @if (orderMode()) {
                    <button type="button" class="btn btn-sm btn-outline-primary text-body-emphasis" cdkDragHandle>
                      <bi name="grip-vertical" />
                    </button>
                  }
                  @if (!orderMode()) {
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        name="checked"
                        [checked]="selection.isSelected(selectable)"
                        (change)="$event ? selection.toggle(selectable) : null"
                      />
                    </div>
                  }
                </td>
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
                <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_PROD_ALLERGENS' | transloco }}</th>
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
                      routerLink="../../../../orders"
                      [queryParams]="{productIds: product.id}"
                    >
                      <bi name="stack" />
                      {{ 'NAV_ORDERS' | transloco }}
                    </a>
                    <a
                      type="button"
                      class="d-flex gap-2 align-items-center"
                      ngbDropdownItem
                      routerLink="../../../../bills"
                      [queryParams]="{productIds: product.id}"
                    >
                      <bi name="cash-coin" />
                      {{ 'NAV_BILLS' | transloco }}
                    </a>
                    <div class="dropdown-divider"></div>
                    <a type="button" class="d-flex gap-2 align-items-center" ngbDropdownItem [routerLink]="'../../../' + product.id">
                      <bi name="pencil-square" />
                      {{ 'EDIT' | transloco }}
                    </a>
                    <button
                      type="button"
                      class="d-flex gap-2 align-items-center text-danger-emphasis"
                      ngbDropdownItem
                      (click)="onDelete(product.id, $event)"
                    >
                      <bi name="trash" />
                      {{ 'DELETE' | transloco }}
                    </button>
                  </app-action-dropdown>
                </td>
              </ng-container>

              <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
              <tr
                *ngbRowDef="let product; columns: columnsToDisplay"
                ngb-row
                cdkDrag
                [cdkDragData]="product"
                [routerLink]="'../../../' + product.id"
              ></tr>
            </table>
          </div>
        }
      }

      <app-progress-bar [show]="isLoading()" />
    </div>
  `,
  styles: [AbstractModelsWithNameListWithDeleteAndOrderStyle],
  selector: 'app-product-group-by-id-products',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    AsyncPipe,
    DfxCurrencyCentPipe,
    LowerCasePipe,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    NgbTooltip,
    TranslocoPipe,
    DfxTableModule,
    DfxSortModule,
    DfxImplodePipe,
    DfxArrayPluck,
    ScrollableToolbarComponent,
    AppSpinnerRowComponent,
    BiComponent,
    AppSoldOutPipe,
    AppOrderModeSwitchComponent,
    AppTextWithColorIndicatorComponent,
    EntitiesHeaderWithPlaceholderLayout,
    AppProgressBarComponent,
    ActionDropdownComponent,
    NgbDropdownItem,
  ],
})
export class ProductsByGroupComponent extends AbstractModelsWithNameListByIdComponent<GetProductMaxResponse, GetProductGroupResponse> {
  constructor(
    private entityService: ProductsService,
    groupsService: ProductGroupsService,
  ) {
    super(entityService, groupsService);

    this.columnsToDisplay = ['name', 'price', 'soldOut', 'initialStock', 'printer', 'allergens', 'actions'];
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

  drop(groupId: number, event: CdkDragDrop<GetProductMaxResponse[]>): void {
    const items = this._dataSource.data.slice();
    const previousIndex = items.findIndex((d) => d.id === event.item.data.id);

    moveItemInArray(items, previousIndex, event.currentIndex);

    this._dataSource.data = items;

    this.entityService
      .order$(
        groupId,
        items.map((it, i) => ({
          entityId: it.id,
          order: i,
        })),
      )
      .subscribe();
  }
}
