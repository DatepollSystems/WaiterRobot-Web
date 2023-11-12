import {AsyncPipe, NgClass, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxArrayPluck, DfxImplodePipe} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';

import {AppSoldOutPipe} from '../../_shared/ui/app-sold-out.pipe';
import {ScrollableToolbarComponent} from '../../_shared/ui/button/scrollable-toolbar.component';
import {AppTextWithColorIndicatorComponent} from '../../_shared/ui/color/app-text-with-color-indicator.component';
import {DfxCurrencyCentPipe} from '../../_shared/ui/currency.pipe';
import {AppSpinnerRowComponent} from '../../_shared/ui/loading/app-spinner-row.component';
import {AbstractModelsWithNameListWithDeleteComponent} from '../../_shared/ui/models-list-with-delete/abstract-models-with-name-list-with-delete.component';
import {GetProductMaxResponse} from '../../_shared/waiterrobot-backend';
import {ProductsService} from './_services/products.service';

@Component({
  template: `
    <h1>{{ 'HOME_PROD_ALL' | tr }}</h1>

    <scrollable-toolbar>
      <div>
        <a routerLink="../create" class="btn btn-sm btn-success">
          <bi name="plus-circle" />
          {{ 'ADD_2' | tr }}</a
        >
      </div>

      <div ngbTooltip="{{ !selection.hasValue() ? ('HOME_PROD_SELECT' | tr) : undefined }}">
        <button class="btn btn-sm btn-danger" [class.disabled]="!selection.hasValue()" (click)="onDeleteSelected()">
          <bi name="trash" />
          {{ 'DELETE' | tr }}
        </button>
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
          <td *ngbCellDef="let selectable" ngb-cell>
            <div class="form-check">
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
          <th *ngbHeaderCellDef ngb-header-cell>{{ 'HOME_PROD_ALLERGENS' | tr }}</th>
          <td *ngbCellDef="let product" ngb-cell>{{ product.allergens | a_pluck: 'shortName' | s_implode: ', ' }}</td>
        </ng-container>

        <ng-container ngbColumnDef="actions">
          <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | tr }}</th>
          <td *ngbCellDef="let product" ngb-cell>
            <a
              class="btn btn-sm m-1 btn-outline-success text-body-emphasis"
              routerLink="../{{ product.id }}"
              ngbTooltip="{{ 'EDIT' | tr }}"
            >
              <bi name="pencil-square" />
            </a>
            <button
              type="button"
              class="btn btn-sm m-1 btn-outline-danger text-body-emphasis"
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

    <app-spinner-row [show]="isLoading" />
  `,
  selector: 'app-all-products',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ScrollableToolbarComponent,
    DfxTr,
    BiComponent,
    NgIf,
    NgClass,
    ReactiveFormsModule,
    DfxTableModule,
    AsyncPipe,
    DfxSortModule,
    DfxCurrencyCentPipe,
    DfxArrayPluck,
    DfxImplodePipe,
    AppSpinnerRowComponent,
    RouterLink,
    NgbTooltip,
    AppSoldOutPipe,
    AppTextWithColorIndicatorComponent,
  ],
})
export class AllProductsComponent extends AbstractModelsWithNameListWithDeleteComponent<GetProductMaxResponse> {
  constructor(entitiesService: ProductsService) {
    super(entitiesService);

    this.columnsToDisplay = ['group', 'name', 'price', 'soldOut', 'initialStock', 'printer', 'allergens', 'actions'];

    this.sortingDataAccessors = new Map();
    this.sortingDataAccessors.set('group', (it) => it.group.name);
    this.sortingDataAccessors.set('printer', (it) => it.printer.name);
  }
}
