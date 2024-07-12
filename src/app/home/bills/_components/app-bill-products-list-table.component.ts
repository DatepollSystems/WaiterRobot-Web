import {AfterViewInit, ChangeDetectionStrategy, Component, input, signal, viewChild} from '@angular/core';
import {RouterLink} from '@angular/router';
import {TranslocoPipe} from '@jsverse/transloco';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {GetImplodedBillProductResponse} from '@shared/waiterrobot-backend';

import {DfxSortModule, DfxTableModule, NgbSort, NgbTableDataSource} from 'dfx-bootstrap-table';
import {DfxCurrencyCentPipe} from 'dfx-helper';

@Component({
  template: `
    <div class="table-responsive">
      <table ngb-table ngb-sort ngbSortActive="product" ngbSortDirection="asc" [hover]="true" [dataSource]="dataSource()">
        <ng-container ngbColumnDef="product">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_PROD' | transloco }}</th>
          <td *ngbCellDef="let order" ngb-cell>
            <div class="d-flex align-items-center gap-2">
              <span class="badge rounded-pill text-bg-info">{{ order.amount }} x</span>
              <a [routerLink]="'../../products/p/' + order.productId">
                {{ order.name }}
              </a>
            </div>
          </td>
          <td *ngbFooterCellDef ngb-footer-cell>Gesamt</td>
        </ng-container>

        <ng-container ngbColumnDef="pricePerPiece">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header class="ws-nowrap">{{ 'PRICE_PER_PIECE' | transloco }}</th>
          <td *ngbCellDef="let order" ngb-cell>{{ order.pricePaidPerPiece | currency }}</td>
          <td *ngbFooterCellDef></td>
        </ng-container>

        <ng-container ngbColumnDef="priceSum">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'PRICE' | transloco }}</th>
          <td *ngbCellDef="let order" ngb-cell>
            {{ order.pricePaidSum | currency }}
          </td>
          <td *ngbFooterCellDef>{{ priceSum() | currency }}</td>
        </ng-container>

        <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
        <tr *ngbRowDef="let order; columns: columnsToDisplay" ngb-row></tr>
        <tr *ngbFooterRowDef="columnsToDisplay" ngb-footer-row></tr>
      </table>
    </div>
  `,
  styles: `
    tr.cdk-footer-row td {
      font-weight: bold;
    }
  `,
  standalone: true,
  selector: 'app-bill-products-list-table',
  imports: [DfxSortModule, DfxTableModule, TranslocoPipe, RouterLink, NgbTooltip, DfxCurrencyCentPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppOrderProductsListTableComponent implements AfterViewInit {
  billProducts = input.required<GetImplodedBillProductResponse[]>();
  priceSum = input.required<number>();

  sort = viewChild(NgbSort);
  columnsToDisplay = ['product', 'pricePerPiece', 'priceSum'];

  dataSource = signal(new NgbTableDataSource<GetImplodedBillProductResponse>());

  ngAfterViewInit(): void {
    const dataSource = new NgbTableDataSource<GetImplodedBillProductResponse>(this.billProducts());
    dataSource.sortingDataAccessor = (item, property: string) => {
      switch (property) {
        default:
          return item[property as keyof GetImplodedBillProductResponse] as string | number;
      }
    };
    dataSource.sort = this.sort();
    this.dataSource.set(dataSource);
  }
}
