import {AsyncPipe, DatePipe} from '@angular/common';
import {AfterViewInit, booleanAttribute, ChangeDetectionStrategy, Component, Input, ViewChild} from '@angular/core';
import {RouterLink} from '@angular/router';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {DfxSortModule, DfxTableModule, NgbSort, NgbTableDataSource} from 'dfx-bootstrap-table';
import {DfxTr} from 'dfx-translate';

import {Subject} from 'rxjs';
import {GetImplodedOrderProductResponse} from 'src/app/_shared/waiterrobot-backend';

import {AppOrderProductStateBadgeComponent} from '../app-order-product-state-badge.component';

@Component({
  template: `
    <div class="table-responsive">
      <table ngb-table ngb-sort ngbSortActive="product" ngbSortDirection="asc" [hover]="true" [dataSource]="(dataSource$ | async) ?? []">
        <ng-container ngbColumnDef="product">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_PROD' | tr }}</th>
          <td *ngbCellDef="let order" ngb-cell>
            <div class="d-flex align-items-center gap-2">
              <span class="badge rounded-pill text-bg-info" [ngbTooltip]="'AMOUNT' | tr">{{ order.amount }}x</span>
              <a [routerLink]="'../../products/' + order.product.id">
                {{ order.product.name }}
              </a>
            </div>
          </td>
        </ng-container>

        <ng-container ngbColumnDef="note">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_ORDER_NOTE' | tr }}</th>
          <td *ngbCellDef="let order" ngb-cell>
            <code>{{ order.note }}</code>
          </td>
        </ng-container>

        <ng-container ngbColumnDef="printState">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'STATE' | tr }}</th>
          <td *ngbCellDef="let order" ngb-cell>
            <app-order-product-state-badge
              [printState]="order.printState"
              [sentToPrinterAt]="order.sentToPrinterAt"
              [printedAt]="order.printedAt"
            />
          </td>
        </ng-container>

        <ng-container ngbColumnDef="printedBy">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAV_PRINTERS' | tr }}</th>
          <td *ngbCellDef="let order" ngb-cell>
            <a [routerLink]="'../../printers/' + order.printedBy.id">
              {{ order.printedBy.name }}
            </a>
          </td>
        </ng-container>

        <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
        <tr *ngbRowDef="let order; columns: columnsToDisplay" ngb-row></tr>
      </table>
    </div>
  `,
  standalone: true,
  selector: 'app-order-products-list-table',
  imports: [DfxSortModule, DfxTableModule, DfxTr, AppOrderProductStateBadgeComponent, AsyncPipe, DatePipe, RouterLink, NgbTooltip],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppOrderProductsListTableComponent implements AfterViewInit {
  @Input({required: true}) orderProducts!: GetImplodedOrderProductResponse[];

  @ViewChild(NgbSort) sort?: NgbSort;
  columnsToDisplay = ['product', 'note', 'printState', 'printedBy'];

  @Input({transform: booleanAttribute})
  set hidePrintedBy(it: boolean) {
    if (it) {
      this.columnsToDisplay.pop();
    }
  }

  dataSource$ = new Subject<NgbTableDataSource<GetImplodedOrderProductResponse>>();

  ngAfterViewInit(): void {
    const dataSource = new NgbTableDataSource<GetImplodedOrderProductResponse>(this.orderProducts);
    dataSource.sortingDataAccessor = (item, property: string) => {
      switch (property) {
        case 'product':
          return item.product.name;
        case 'printedBy':
          return item.printedBy.name;
        default:
          return item[property as keyof GetImplodedOrderProductResponse] as string | number;
      }
    };
    dataSource.sort = this.sort;
    this.dataSource$.next(dataSource);
  }
}
