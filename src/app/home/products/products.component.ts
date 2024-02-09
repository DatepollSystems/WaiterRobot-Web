import {AsyncPipe, NgClass} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxArrayPluck, DfxImplodePipe} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';

import {AppProgressBarComponent} from '../../_shared/ui/loading/app-progress-bar.component';
import {GetProductMaxResponse} from '../../_shared/waiterrobot-backend';
import {AppTextWithColorIndicatorComponent} from '../_shared/components/color/app-text-with-color-indicator.component';
import {ScrollableToolbarComponent} from '../_shared/components/scrollable-toolbar.component';
import {AbstractModelsWithNameListWithDeleteComponent} from '../_shared/list/models-list-with-delete/abstract-models-with-name-list-with-delete.component';
import {AppSoldOutPipe} from '../_shared/pipes/app-sold-out.pipe';
import {DfxCurrencyCentPipe} from '../_shared/pipes/currency.pipe';
import {ProductsService} from './_services/products.service';

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      <h1 class="my-0">{{ 'HOME_PROD_ALL' | tr }}</h1>

      <scrollable-toolbar>
        <div>
          <a routerLink="../create" class="btn btn-sm btn-success">
            <bi name="plus-circle" />
            {{ 'ADD_2' | tr }}</a
          >
        </div>

        <div ngbTooltip="{{ !selection.hasValue() ? ('HOME_PROD_SELECT_INFO' | tr) : undefined }}">
          <button class="btn btn-sm btn-danger" [class.disabled]="!selection.hasValue()" (click)="onDeleteSelected()">
            <bi name="trash" />
            {{ 'DELETE' | tr }}
          </button>
        </div>
      </scrollable-toolbar>

      <form>
        <div class="input-group">
          <input class="form-control ml-2" type="text" [formControl]="filter" placeholder="{{ 'SEARCH' | tr }}" />
          @if ((filter.value?.length ?? 0) > 0) {
            <button
              class="btn btn-outline-secondary"
              type="button"
              ngbTooltip="{{ 'CLEAR' | tr }}"
              placement="bottom"
              (click)="filter.reset()"
            >
              <bi name="x-circle-fill" />
            </button>
          }
        </div>
      </form>

      <div class="table-responsive">
        <table ngb-table [hover]="true" [dataSource]="(dataSource$ | async) ?? []" ngb-sort ngbSortActive="group" ngbSortDirection="asc">
          <ng-container ngbColumnDef="select">
            <th *ngbHeaderCellDef ngb-header-cell>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  name="checked"
                  (change)="$event ? toggleAllRows() : null"
                  [checked]="selection.hasValue() && isAllSelected()"
                />
              </div>
            </th>
            <td *ngbCellDef="let selectable" ngb-cell (click)="$event.stopPropagation()">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  name="checked"
                  (change)="$event ? selection.toggle(selectable) : null"
                  [checked]="selection.isSelected(selectable)"
                />
              </div>
            </td>
          </ng-container>

          <ng-container ngbColumnDef="group">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_PROD_GROUP_PRODUCTS_VIEW' | tr }}</th>
            <td *ngbCellDef="let product" ngb-cell>
              <app-text-with-color-indicator [color]="product.group.color">
                {{ product.group.name }}
              </app-text-with-color-indicator>
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
              @if (product.initialStock) {
                <span>
                  {{ product.initialStock - product.amountOrdered }}
                </span>
              }
            </td>
          </ng-container>

          <ng-container ngbColumnDef="printer">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAV_PRINTERS' | tr }}</th>
            <td *ngbCellDef="let product" ngb-cell>{{ product.printer.name }}</td>
          </ng-container>

          <ng-container ngbColumnDef="allergens">
            <th *ngbHeaderCellDef ngb-header-cell>{{ 'HOME_PROD_ALLERGENS' | tr }}</th>
            <td *ngbCellDef="let product" ngb-cell>{{ product.allergens | a_pluck: 'shortName' | s_implode: ', ' }}</td>
          </ng-container>

          <ng-container ngbColumnDef="actions">
            <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | tr }}</th>
            <td *ngbCellDef="let product" ngb-cell>
              <a
                class="btn btn-sm mx-1 btn-outline-success text-body-emphasis"
                routerLink="../{{ product.id }}"
                ngbTooltip="{{ 'EDIT' | tr }}"
              >
                <bi name="pencil-square" />
              </a>

              <a
                class="btn btn-sm mx-1 btn-outline-secondary text-body-emphasis"
                routerLink="../../orders"
                [queryParams]="{productIds: product.id}"
                ngbTooltip="{{ 'NAV_ORDERS' | tr }}"
                (click)="$event.stopPropagation()"
              >
                <bi name="stack" />
              </a>
              <a
                class="btn btn-sm mx-1 btn-outline-secondary text-body-emphasis"
                routerLink="../../bills"
                [queryParams]="{productIds: product.id}"
                ngbTooltip="{{ 'NAV_BILLS' | tr }}"
                (click)="$event.stopPropagation()"
              >
                <bi name="cash-coin" />
              </a>
              <button
                type="button"
                class="btn btn-sm mx-1 btn-outline-danger text-body-emphasis"
                ngbTooltip="{{ 'DELETE' | tr }}"
                (click)="onDelete(product.id, $event)"
              >
                <bi name="trash" />
              </button>
            </td>
          </ng-container>

          <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
          <tr *ngbRowDef="let product; columns: columnsToDisplay" ngb-row routerLink="../{{ product.id }}"></tr>
        </table>
      </div>

      <app-progress-bar [show]="isLoading()" />
    </div>
  `,
  selector: 'app-all-products',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ScrollableToolbarComponent,
    DfxTr,
    BiComponent,
    NgClass,
    ReactiveFormsModule,
    DfxTableModule,
    AsyncPipe,
    DfxSortModule,
    DfxCurrencyCentPipe,
    DfxArrayPluck,
    DfxImplodePipe,
    RouterLink,
    NgbTooltip,
    AppSoldOutPipe,
    AppTextWithColorIndicatorComponent,
    AppProgressBarComponent,
  ],
})
export class ProductsComponent extends AbstractModelsWithNameListWithDeleteComponent<GetProductMaxResponse> {
  constructor(entitiesService: ProductsService) {
    super(entitiesService);

    this.columnsToDisplay = ['group', 'name', 'price', 'soldOut', 'initialStock', 'printer', 'allergens', 'actions'];

    this.sortingDataAccessors = new Map();
    this.sortingDataAccessors.set('group', (it) => it.group.name);
    this.sortingDataAccessors.set('printer', (it) => it.printer.name);
  }
}
