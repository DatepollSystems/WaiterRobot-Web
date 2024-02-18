import {AsyncPipe, DatePipe} from '@angular/common';
import {AfterViewInit, ChangeDetectionStrategy, Component, Input, ViewChild} from '@angular/core';
import {RouterLink} from '@angular/router';

import {DfxCurrencyCentPipe} from '@home-shared/pipes/currency.pipe';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {GetImplodedBillProductResponse} from '@shared/waiterrobot-backend';

import {DfxSortModule, DfxTableModule, NgbSort, NgbTableDataSource} from 'dfx-bootstrap-table';
import {NgSub} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';

import {Subject} from 'rxjs';

@Component({
  template: `
    <div *ngSub="dataSource$; let dataSource" class="table-responsive">
      <table ngb-table ngb-sort ngbSortActive="product" ngbSortDirection="asc" [hover]="true" [dataSource]="dataSource">
        <ng-container ngbColumnDef="product">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_PROD' | tr }}</th>
          <td *ngbCellDef="let order" ngb-cell>
            <div class="d-flex align-items-center gap-2">
              <span class="badge rounded-pill text-bg-info">{{ order.amount }} x</span>
              <a [routerLink]="'../../products/' + order.productId">
                {{ order.name }}
              </a>
            </div>
          </td>
          <td *ngbFooterCellDef ngb-footer-cell>Gesamt</td>
        </ng-container>

        <ng-container ngbColumnDef="pricePerPiece">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header class="ws-nowrap">{{ 'PRICE_PER_PIECE' | tr }}</th>
          <td *ngbCellDef="let order" ngb-cell>{{ order.pricePaidPerPiece | currency }}</td>
          <td *ngbFooterCellDef>ngb-footer-cell</td>
        </ng-container>

        <ng-container ngbColumnDef="priceSum">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'PRICE' | tr }}</th>
          <td *ngbCellDef="let order" ngb-cell>
            {{ order.pricePaidSum | currency }}
          </td>
          <td *ngbFooterCellDef>ngb-footer-cell{{ priceSum | currency }}</td>
        </ng-container>

        <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
        <tr *ngbRowDef="let order; columns: columnsToDisplay" ngb-row></tr>
        <tr *ngbFooterRowDef="columnsToDisplay" ngb-footer-row></tr>
      </table>
    </div>
  `,
  styles: [
    `
      tr.cdk-footer-row td {
        font-weight: bold;
      }
    `,
  ],
  standalone: true,
  selector: 'app-bill-products-list-table',
  imports: [DfxSortModule, DfxTableModule, DfxTr, AsyncPipe, DatePipe, RouterLink, NgSub, NgbTooltip, DfxCurrencyCentPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppOrderProductsListTableComponent implements AfterViewInit {
  @Input({required: true}) billProducts!: GetImplodedBillProductResponse[];
  @Input({required: true}) priceSum!: number;

  @ViewChild(NgbSort) sort?: NgbSort;
  columnsToDisplay = ['product', 'pricePerPiece', 'priceSum'];

  dataSource$ = new Subject<NgbTableDataSource<GetImplodedBillProductResponse>>();

  ngAfterViewInit(): void {
    const dataSource = new NgbTableDataSource<GetImplodedBillProductResponse>(this.billProducts);
    dataSource.sortingDataAccessor = (item, property: string) => {
      switch (property) {
        default:
          return item[property as keyof GetImplodedBillProductResponse] as string | number;
      }
    };
    dataSource.sort = this.sort;
    this.dataSource$.next(dataSource);
  }
}
