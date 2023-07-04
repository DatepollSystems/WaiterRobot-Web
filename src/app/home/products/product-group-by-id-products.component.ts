import {AsyncPipe, LowerCasePipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxImplodePipe} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';
import {AppBtnToolbarComponent} from '../../_shared/ui/app-btn-toolbar.component';
import {AppSoldOutPipe} from '../../_shared/ui/app-sold-out.pipe';
import {AppIconsModule} from '../../_shared/ui/icons.module';
import {AppSpinnerRowComponent} from '../../_shared/ui/loading/app-spinner-row.component';
import {AbstractModelsWithNameListByIdComponent} from '../../_shared/ui/models-list-by-id/abstract-models-with-name-list-by-id.component';
import {DfxArrayPluck} from '../../_shared/ui/pluck.pipe';
import {GetProductGroupResponse, GetProductMaxResponse} from '../../_shared/waiterrobot-backend';
import {ProductGroupsService} from './_services/product-groups.service';

import {ProductsService} from './_services/products.service';
import {DfxCurrencyCentPipe} from '../../_shared/ui/currency.pipe';

@Component({
  template: `
    <ng-container *ngIf="entity$ | async as entity">
      <h1>{{ entity?.name }} {{ 'HOME_PROD_GROUP_PRODUCTS_VIEW' | tr }}</h1>

      <btn-toolbar>
        <div>
          <a routerLink="../../../create" [queryParams]="{group: entity?.id}" class="btn btn-sm btn-outline-success">
            <i-bs name="plus-circle" />
            {{ 'HOME_PROD' | tr }} {{ 'ADD_3' | tr | lowercase }}</a
          >
        </div>
        <div>
          <a routerLink="../../{{ entity?.id }}" class="btn btn-sm btn-outline-primary">
            <i-bs name="pencil-square" />
            {{ 'HOME_PROD_GROUP' | tr }} {{ 'EDIT' | tr | lowercase }}</a
          >
        </div>

        <div>
          <button class="btn btn-sm btn-outline-danger" [class.disabled]="!selection.hasValue()" (click)="onDeleteSelected()">
            <i-bs name="trash" />
            {{ 'DELETE' | tr }}
          </button>
        </div>
      </btn-toolbar>
    </ng-container>

    <form>
      <div class="input-group">
        <input class="form-control ml-2 bg-dark text-white" type="text" [formControl]="filter" placeholder="{{ 'SEARCH' | tr }}" />
        <button
          class="btn btn-outline-secondary"
          type="button"
          ngbTooltip="{{ 'CLEAR' | tr }}"
          placement="bottom"
          (click)="filter.reset()"
          *ngIf="(filter.value?.length ?? 0) > 0"
        >
          <i-bs name="x-circle-fill" />
        </button>
      </div>
    </form>

    <div class="table-responsive">
      <table ngb-table [hover]="true" [dataSource]="(dataSource$ | async) ?? []" ngb-sort ngbSortActive="name" ngbSortDirection="asc">
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

        <ng-container ngbColumnDef="name">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAME' | tr }}</th>
          <td *ngbCellDef="let product" ngb-cell>{{ product.name }}</td>
        </ng-container>

        <ng-container ngbColumnDef="price">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_PROD_PRICE' | tr }}</th>
          <td *ngbCellDef="let product" ngb-cell>{{ product.price | currency : 'EUR' }}</td>
        </ng-container>

        <ng-container ngbColumnDef="soldOut">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_PROD_AVAILABLE' | tr }}</th>
          <td *ngbCellDef="let product" ngb-cell>{{ product.soldOut | soldOut }}</td>
        </ng-container>

        <ng-container ngbColumnDef="amountLeft">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_PROD_AMOUNT_LEFT' | tr }}</th>
          <td *ngbCellDef="let product" ngb-cell>{{ product.amountLeft - product.amountOrdered }}</td>
        </ng-container>

        <ng-container ngbColumnDef="printer">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAV_PRINTERS' | tr }}</th>
          <td *ngbCellDef="let product" ngb-cell>{{ product.printer.name }}</td>
        </ng-container>

        <ng-container ngbColumnDef="allergens">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_PROD_ALLERGENS' | tr }}</th>
          <td *ngbCellDef="let product" ngb-cell>{{ product.allergens | a_pluck : 'shortName' | s_implode : ', ' }}</td>
        </ng-container>

        <ng-container ngbColumnDef="actions">
          <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | tr }}</th>
          <td *ngbCellDef="let product" ngb-cell>
            <a class="btn btn-sm m-1 btn-outline-success text-white" routerLink="../../../{{ product.id }}" ngbTooltip="{{ 'EDIT' | tr }}">
              <i-bs name="pencil-square" />
            </a>
            <button
              type="button"
              class="btn btn-sm m-1 btn-outline-danger text-white"
              ngbTooltip="{{ 'DELETE' | tr }}"
              (click)="onDelete(product.id, $event)"
            >
              <i-bs name="trash" />
            </button>
          </td>
        </ng-container>

        <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
        <tr *ngbRowDef="let product; columns: columnsToDisplay" ngb-row routerLink="../../../{{ product.id }}"></tr>
      </table>
    </div>

    <app-spinner-row [show]="isLoading" />
  `,
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
    NgbTooltip,
    DfxTr,
    DfxTableModule,
    DfxSortModule,
    DfxImplodePipe,
    DfxArrayPluck,
    AppBtnToolbarComponent,
    AppSpinnerRowComponent,
    AppIconsModule,
    AppSoldOutPipe,
  ],
})
export class ProductGroupByIdProductsComponent extends AbstractModelsWithNameListByIdComponent<
  GetProductMaxResponse,
  GetProductGroupResponse
> {
  constructor(entityService: ProductsService, groupsService: ProductGroupsService) {
    super(entityService, groupsService);

    this.columnsToDisplay = ['name', 'price', 'soldOut', 'amountLeft', 'printer', 'allergens', 'actions'];
  }
}
