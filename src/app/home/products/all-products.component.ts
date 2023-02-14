import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AbstractModelsListWithDeleteComponent} from '../../_shared/ui/abstract-models-list-with-delete.component';
import {GetProductMaxResponse} from '../../_shared/waiterrobot-backend';

import {ProductsService} from './_services/products.service';
import {AppBtnToolbarComponent} from '../../_shared/ui/app-btn-toolbar.component';
import {DfxTr} from 'dfx-translate';
import {AppIconsModule} from '../../_shared/ui/icons.module';
import {AsyncPipe, CurrencyPipe, NgIf} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxArrayPluck} from '../../_shared/ui/pluck.pipe';
import {DfxImplodePipe} from 'dfx-helper';
import {AppSpinnerRowComponent} from '../../_shared/ui/loading/app-spinner-row.component';
import {RouterLink} from '@angular/router';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

@Component({
  template: `
    <h1>{{ 'HOME_PROD_ALL' | tr }}</h1>

    <btn-toolbar>
      <div>
        <a routerLink="../create" class="btn btn-sm btn-outline-success">
          <i-bs name="plus-circle"></i-bs>
          {{ 'ADD_2' | tr }}</a
        >
      </div>

      <div *ngIf="selection">
        <button class="btn btn-sm btn-outline-danger" [class.disabled]="!selection.hasValue()" (click)="onDeleteSelected()">
          <i-bs name="trash"></i-bs>
          {{ 'DELETE' | tr }}
        </button>
      </div>
    </btn-toolbar>

    <form>
      <div class="input-group">
        <input class="form-control ml-2 bg-dark text-white" type="text" [formControl]="filter" placeholder="{{ 'SEARCH' | tr }}" />
        <button
          class="btn btn-outline-secondary"
          type="button"
          ngbTooltip="{{ 'CLEAR' | tr }}"
          placement="bottom"
          (click)="filter.reset()"
          *ngIf="(filter.value?.length ?? 0) > 0">
          <i-bs name="x-circle-fill"></i-bs>
        </button>
      </div>
    </form>

    <div class="table-responsive" *ngIf="dataSource$ | async as dataSource; else loading">
      <table ngb-table [hover]="true" [dataSource]="dataSource" ngb-sort ngbSortActive="groupName" ngbSortDirection="asc">
        <ng-container ngbColumnDef="select">
          <th *ngbHeaderCellDef ngb-header-cell>
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                name="checked"
                (change)="$event ? toggleAllRows() : null"
                [checked]="selection!.hasValue() && isAllSelected()" />
            </div>
          </th>
          <td *ngbCellDef="let selectable" ngb-cell>
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                name="checked"
                (click)="$event.stopPropagation()"
                (change)="$event ? selection!.toggle(selectable) : null"
                [checked]="selection!.isSelected(selectable)" />
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
          <td *ngbCellDef="let product" ngb-cell>{{ product.soldOut ? '⛔' : '✅' }}</td>
        </ng-container>

        <ng-container ngbColumnDef="groupName">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_PROD_GROUP_PRODUCTS_VIEW' | tr }}</th>
          <td *ngbCellDef="let product" ngb-cell>{{ product.group.name }}</td>
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
            <a class="btn btn-sm m-1 btn-outline-success text-white" routerLink="../{{ product.id }}" ngbTooltip="{{ 'EDIT' | tr }}">
              <i-bs name="pencil-square"></i-bs>
            </a>
            <button
              type="button"
              class="btn btn-sm m-1 btn-outline-danger text-white"
              ngbTooltip="{{ 'DELETE' | tr }}"
              (click)="onDelete(product.id, $event)">
              <i-bs name="trash"></i-bs>
            </button>
          </td>
        </ng-container>

        <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
        <tr *ngbRowDef="let product; columns: columnsToDisplay" ngb-row routerLink="../{{ product.id }}"></tr>
      </table>
    </div>

    <ng-template #loading>
      <app-spinner-row></app-spinner-row>
    </ng-template>
  `,
  selector: 'app-all-products',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AppBtnToolbarComponent,
    DfxTr,
    AppIconsModule,
    NgIf,
    ReactiveFormsModule,
    DfxTableModule,
    AsyncPipe,
    DfxSortModule,
    CurrencyPipe,
    DfxArrayPluck,
    DfxImplodePipe,
    AppSpinnerRowComponent,
    RouterLink,
    NgbTooltip,
  ],
})
export class AllProductsComponent extends AbstractModelsListWithDeleteComponent<GetProductMaxResponse> {
  override columnsToDisplay = ['name', 'price', 'soldOut', 'groupName', 'printer', 'allergens', 'actions'];

  constructor(entitiesService: ProductsService) {
    super(entitiesService);

    this.setSelectable();
  }
}