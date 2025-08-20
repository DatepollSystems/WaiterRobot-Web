import {AfterViewInit, ChangeDetectionStrategy, Component, input, signal, viewChild} from '@angular/core';
import {RouterLink} from '@angular/router';

import {TranslocoPipe} from '@jsverse/transloco';
import {DfxSortModule, DfxTableModule, NgbSort, NgbTableDataSource} from 'dfx-bootstrap-table';
import {DfxCurrencyCentPipe} from 'dfx-helper';

import {APIType} from '@shared/api';

@Component({
  template: `
    <div class="table-responsive">
      <table [hover]="true" [dataSource]="dataSource()" ngb-table ngb-sort ngbSortActive="product" ngbSortDirection="asc">
        <ng-container ngbColumnDef="product">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>
            {{ 'HOME_PROD' | transloco }}
          </th>
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
          <th class="ws-nowrap" *ngbHeaderCellDef ngb-header-cell ngb-sort-header>
            {{ 'PRICE_PER_PIECE' | transloco }}
          </th>
          <td *ngbCellDef="let order" ngb-cell>
            {{ order.pricePaidPerPiece | currency }}
          </td>
          <td *ngbFooterCellDef></td>
        </ng-container>

        <ng-container ngbColumnDef="priceSum">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>
            {{ 'PRICE' | transloco }}
          </th>
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
  selector: 'app-bill-products-list-table',
  imports: [DfxSortModule, DfxTableModule, TranslocoPipe, RouterLink, DfxCurrencyCentPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppOrderProductsListTableComponent implements AfterViewInit {
  billProducts = input.required<APIType['GetImplodedBillProductResponse'][]>();
  priceSum = input.required<number>();

  sort = viewChild(NgbSort);
  columnsToDisplay = ['product', 'pricePerPiece', 'priceSum'];

  dataSource = signal(new NgbTableDataSource<APIType['GetImplodedBillProductResponse']>());

  ngAfterViewInit(): void {
    const dataSource = new NgbTableDataSource(this.billProducts());
    dataSource.sortingDataAccessor = (item, property: string) => {
      switch (property) {
        default:
          return item[property as keyof APIType['GetImplodedBillProductResponse']] as string | number;
      }
    };
    dataSource.sort = this.sort();
    this.dataSource.set(dataSource);
  }
}
