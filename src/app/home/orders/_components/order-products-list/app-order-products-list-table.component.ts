import {AsyncPipe, DatePipe, NgIf} from '@angular/common';
import {AfterViewInit, ChangeDetectionStrategy, Component, Input, ViewChild} from '@angular/core';
import {RouterLink} from '@angular/router';
import {DfxSortModule, DfxTableModule, NgbSort, NgbTableDataSource} from 'dfx-bootstrap-table';
import {DfxTr} from 'dfx-translate';
import {Subject} from 'rxjs';
import {GetOrderProductResponse} from '../../../../_shared/waiterrobot-backend';
import {AppOrderProductStateBadgeComponent} from '../app-order-product-state-badge.component';
import {NgSub} from 'dfx-helper';

@Component({
  template: `
    <div class="table-responsive" *ngSub="dataSource$; let dataSource">
      <table ngb-table [hover]="true" [dataSource]="dataSource" ngb-sort ngbSortActive="product" ngbSortDirection="asc">
        <ng-container ngbColumnDef="product">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_PROD' | tr }}</th>
          <td *ngbCellDef="let order" ngb-cell>
            <a routerLink="/home/products/{{ order.product.id }}">
              {{ order.product.name }}
            </a>
          </td>
        </ng-container>

        <ng-container ngbColumnDef="amount">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'AMOUNT' | tr }}</th>
          <td *ngbCellDef="let order" ngb-cell>
            {{ order.amount }}
          </td>
        </ng-container>

        <ng-container ngbColumnDef="note">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_ORDER_NOTE' | tr }}</th>
          <td *ngbCellDef="let order" ngb-cell>
            {{ order.note }}
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
            <a routerLink="/home/printers/{{ order.printedBy.id }}">
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
  imports: [DfxSortModule, DfxTableModule, DfxTr, AppOrderProductStateBadgeComponent, AsyncPipe, NgIf, DatePipe, RouterLink, NgSub],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppOrderProductsListTableComponent implements AfterViewInit {
  @Input({required: true}) orderProducts!: GetOrderProductResponse[];

  @ViewChild(NgbSort) sort?: NgbSort;
  columnsToDisplay = ['product', 'amount', 'note', 'printState', 'printedBy'];

  dataSource$ = new Subject<NgbTableDataSource<GetOrderProductResponse>>();

  ngAfterViewInit(): void {
    const dataSource = new NgbTableDataSource<GetOrderProductResponse>(this.orderProducts);
    dataSource.sortingDataAccessor = (item, property: string) => {
      switch (property) {
        case 'product':
          return item.product.name;
        case 'printedBy':
          return item.printedBy.name;
        default:
          return item[property as keyof GetOrderProductResponse] as string | number;
      }
    };
    dataSource.sort = this.sort;
    this.dataSource$.next(dataSource);
  }
}
