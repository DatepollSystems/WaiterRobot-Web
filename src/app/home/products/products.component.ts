import {AsyncPipe, NgClass} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@ngneat/transloco';

import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';
import {GetProductMaxResponse} from '@shared/waiterrobot-backend';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxArrayPluck, DfxCurrencyCentPipe, DfxImplodePipe} from 'dfx-helper';
import {AppTextWithColorIndicatorComponent} from '../_shared/components/color/app-text-with-color-indicator.component';
import {ScrollableToolbarComponent} from '../_shared/components/scrollable-toolbar.component';
import {AbstractModelsWithNameListWithDeleteComponent} from '../_shared/list/models-list-with-delete/abstract-models-with-name-list-with-delete.component';
import {AppSoldOutPipe} from '../_shared/pipes/app-sold-out.pipe';
import {ProductsService} from './_services/products.service';

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      <h1 class="my-0">{{ 'HOME_PROD_ALL' | transloco }}</h1>

      <scrollable-toolbar>
        <div>
          <a routerLink="../create" class="btn btn-sm btn-success">
            <bi name="plus-circle" />
            {{ 'ADD_2' | transloco }}</a
          >
        </div>

        <div [ngbTooltip]="!selection.hasValue() ? ('HOME_PROD_SELECT_INFO' | transloco) : undefined">
          <button type="button" class="btn btn-sm btn-danger" [class.disabled]="!selection.hasValue()" (click)="onDeleteSelected()">
            <bi name="trash" />
            {{ 'DELETE' | transloco }}
          </button>
        </div>
      </scrollable-toolbar>

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

      <div class="table-responsive">
        <table ngb-table ngb-sort ngbSortActive="group" ngbSortDirection="asc" [hover]="true" [dataSource]="(dataSource$ | async) ?? []">
          <ng-container ngbColumnDef="select">
            <th *ngbHeaderCellDef ngb-header-cell>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  name="checked"
                  [checked]="selection.hasValue() && isAllSelected()"
                  (change)="$event ? toggleAllRows() : null"
                />
              </div>
            </th>
            <td *ngbCellDef="let selectable" ngb-cell (click)="$event.stopPropagation()">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  name="checked"
                  [checked]="selection.isSelected(selectable)"
                  (change)="$event ? selection.toggle(selectable) : null"
                />
              </div>
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
            <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | transloco }}</th>
            <td *ngbCellDef="let product" ngb-cell>
              <a
                class="btn btn-sm mx-1 btn-outline-success text-body-emphasis"
                [routerLink]="'../' + product.id"
                [ngbTooltip]="'EDIT' | transloco"
              >
                <bi name="pencil-square" />
              </a>

              <a
                class="btn btn-sm mx-1 btn-outline-secondary text-body-emphasis"
                routerLink="../../orders"
                [queryParams]="{productIds: product.id}"
                [ngbTooltip]="'NAV_ORDERS' | transloco"
                (click)="$event.stopPropagation()"
              >
                <bi name="stack" />
              </a>
              <a
                class="btn btn-sm mx-1 btn-outline-secondary text-body-emphasis"
                routerLink="../../bills"
                [queryParams]="{productIds: product.id}"
                [ngbTooltip]="'NAV_BILLS' | transloco"
                (click)="$event.stopPropagation()"
              >
                <bi name="cash-coin" />
              </a>
              <button
                type="button"
                class="btn btn-sm mx-1 btn-outline-danger text-body-emphasis"
                [ngbTooltip]="'DELETE' | transloco"
                (click)="onDelete(product.id, $event)"
              >
                <bi name="trash" />
              </button>
            </td>
          </ng-container>

          <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
          <tr *ngbRowDef="let product; columns: columnsToDisplay" ngb-row [routerLink]="'../' + product.id"></tr>
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
    TranslocoPipe,
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
