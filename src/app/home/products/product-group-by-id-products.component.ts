import {CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {AsyncPipe, LowerCasePipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxArrayPluck, DfxImplodePipe, NgSub} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';

import {AppSoldOutPipe} from '../../_shared/ui/app-sold-out.pipe';
import {ScrollableToolbarComponent} from '../../_shared/ui/button/scrollable-toolbar.component';
import {AppTextWithColorIndicatorComponent} from '../../_shared/ui/color/app-text-with-color-indicator.component';
import {DfxCurrencyCentPipe} from '../../_shared/ui/currency.pipe';
import {AppOrderModeSwitchComponent} from '../../_shared/ui/form/app-order-mode-switch.component';
import {AppSpinnerRowComponent} from '../../_shared/ui/loading/app-spinner-row.component';
import {AbstractModelsWithNameListByIdComponent} from '../../_shared/ui/models-list-by-id/abstract-models-with-name-list-by-id.component';
import {AbstractModelsWithNameListWithDeleteAndOrderStyle} from '../../_shared/ui/models-list-with-delete/abstract-models-with-name-list-with-delete-and-order.component';
import {GetProductGroupResponse, GetProductMaxResponse, GetProductResponse} from '../../_shared/waiterrobot-backend';
import {ProductGroupsService} from './_services/product-groups.service';
import {ProductsService} from './_services/products.service';

@Component({
  template: `
    <ng-container *ngIf="entity$ | async as entity">
      <app-text-with-color-indicator [color]="entity.color" [size]="30" placement="right">
        <h1 class="mb-0">{{ 'HOME_PROD_GROUP_PRODUCTS_VIEW' | tr }} {{ entity?.name }}</h1>
      </app-text-with-color-indicator>

      <!-- This is necessary because other pages utilize the h1 tag, which includes a bottom margin for toolbar
        alignment. However, in this case, we employ the h1 tag with a color indicator, causing the h1 tag not to
        be centered in alignment with the color indicator. To address this, we set the h1 margin to 0,
        requiring us to manually add the margin here for proper alignment with other pages. -->
      <div class="mt-2"></div>

      <scrollable-toolbar>
        <div>
          <a routerLink="../../../create" [queryParams]="{group: entity?.id}" class="btn btn-sm btn-success">
            <bi name="plus-circle" />
            {{ 'HOME_PROD' | tr }} {{ 'ADD_3' | tr | lowercase }}</a
          >
        </div>
        <div>
          <a routerLink="../../{{ entity?.id }}" class="btn btn-sm btn-primary">
            <bi name="pencil-square" />
            {{ 'HOME_PROD_GROUP' | tr }} {{ 'EDIT' | tr | lowercase }}</a
          >
        </div>

        <div ngbTooltip="{{ !selection.hasValue() ? ('HOME_PROD_SELECT' | tr) : undefined }}">
          <button class="btn btn-sm btn-danger" [class.disabled]="!selection.hasValue()" (click)="onDeleteSelected()">
            <bi name="trash" />
            {{ 'DELETE' | tr }}
          </button>
        </div>

        <div class="d-flex align-items-center">
          <app-order-mode-switch [orderMode]="orderMode()" (orderModeChange)="setOrderMode($event)" />
        </div>
      </scrollable-toolbar>

      <form>
        <div class="input-group">
          <input class="form-control ml-2" type="text" [formControl]="filter" placeholder="{{ 'SEARCH' | tr }}" />
          <button
            class="btn btn-outline-secondary"
            type="button"
            ngbTooltip="{{ 'CLEAR' | tr }}"
            placement="bottom"
            (click)="filter.reset()"
            *ngIf="(filter.value?.length ?? 0) > 0"
          >
            <bi name="x-circle-fill" />
          </button>
        </div>
      </form>

      <div class="table-responsive">
        <table
          ngb-table
          [hover]="true"
          *ngSub="dataSource$; let dataSource"
          [dataSource]="dataSource ?? []"
          ngb-sort
          ngbSortActive="name"
          ngbSortDirection="asc"
          [ngbSortDisabled]="orderMode()"
          cdkDropList
          cdkDropListLockAxis="y"
          (cdkDropListDropped)="drop(entity.id, $event)"
          [cdkDropListData]="dataSource"
          [cdkDropListDisabled]="!orderMode()"
        >
          <ng-container ngbColumnDef="select">
            <th *ngbHeaderCellDef ngb-header-cell>
              <div class="form-check" *ngIf="!orderMode()">
                <input
                  class="form-check-input"
                  type="checkbox"
                  name="checked"
                  (change)="$event ? toggleAllRows() : null"
                  [checked]="selection.hasValue() && isAllSelected()"
                />
              </div>
            </th>
            <td *ngbCellDef="let selectable" ngb-cell>
              <button class="btn btn-sm btn-outline-primary text-body-emphasis" cdkDragHandle *ngIf="orderMode()">
                <bi name="grip-vertical" />
              </button>
              <div class="form-check" *ngIf="!orderMode()">
                <input
                  class="form-check-input"
                  type="checkbox"
                  name="checked"
                  (click)="$event.stopPropagation()"
                  (change)="$event ? selection.toggle(selectable) : null"
                  [checked]="selection.isSelected(selectable)"
                />
              </div>
            </td>
          </ng-container>

          <ng-container ngbColumnDef="name">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAME' | tr }}</th>
            <td *ngbCellDef="let product" ngb-cell>{{ product.name }}</td>
          </ng-container>

          <ng-container ngbColumnDef="price">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'PRICE' | tr }}</th>
            <td *ngbCellDef="let product" ngb-cell>{{ product.price | currency }}</td>
          </ng-container>

          <ng-container ngbColumnDef="soldOut">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_PROD_AVAILABLE' | tr }}</th>
            <td *ngbCellDef="let product" ngb-cell>{{ product.soldOut | soldOut }}</td>
          </ng-container>

          <ng-container ngbColumnDef="initialStock">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_PROD_AMOUNT_LEFT' | tr }}</th>
            <td *ngbCellDef="let product" ngb-cell>
              <span *ngIf="product.initialStock">
                {{ product.initialStock - product.amountOrdered }}
              </span>
            </td>
          </ng-container>

          <ng-container ngbColumnDef="printer">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAV_PRINTERS' | tr }}</th>
            <td *ngbCellDef="let product" ngb-cell>{{ product.printer.name }}</td>
          </ng-container>

          <ng-container ngbColumnDef="allergens">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_PROD_ALLERGENS' | tr }}</th>
            <td *ngbCellDef="let product" ngb-cell>{{ product.allergens | a_pluck: 'shortName' | s_implode: ', ' }}</td>
          </ng-container>

          <ng-container ngbColumnDef="actions">
            <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | tr }}</th>
            <td *ngbCellDef="let product" ngb-cell>
              <a
                class="btn btn-sm me-2 btn-outline-success text-body-emphasis"
                routerLink="../../../{{ product.id }}"
                ngbTooltip="{{ 'EDIT' | tr }}"
              >
                <bi name="pencil-square" />
              </a>
              <button
                type="button"
                class="btn btn-sm me-2 btn-outline-danger text-body-emphasis"
                ngbTooltip="{{ 'DELETE' | tr }}"
                (click)="onDelete(product.id, $event)"
              >
                <bi name="trash" />
              </button>
            </td>
          </ng-container>

          <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
          <tr
            *ngbRowDef="let product; columns: columnsToDisplay"
            ngb-row
            cdkDrag
            [cdkDragData]="product"
            routerLink="../../../{{ product.id }}"
          ></tr>
        </table>
      </div>
    </ng-container>

    <app-spinner-row [show]="isLoading" />
  `,
  styles: [AbstractModelsWithNameListWithDeleteAndOrderStyle],
  selector: 'app-product-group-by-id-products',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    RouterLink,
    AsyncPipe,
    DfxCurrencyCentPipe,
    LowerCasePipe,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    NgbTooltip,
    NgSub,
    DfxTr,
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
  ],
})
export class ProductGroupByIdProductsComponent extends AbstractModelsWithNameListByIdComponent<
  GetProductMaxResponse,
  GetProductGroupResponse
> {
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

  drop(groupId: number, event: CdkDragDrop<GetProductResponse[]>): void {
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
