import {NgIf} from '@angular/common';
import {AfterViewInit, ChangeDetectionStrategy, Component, Input, ViewChild} from '@angular/core';
import {RouterLink} from '@angular/router';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {NgxBootstrapIconsModule} from 'ngx-bootstrap-icons';

import {DfxSortModule, DfxTableModule, NgbSort, NgbTableDataSource} from 'dfx-bootstrap-table';
import {DfxTr} from 'dfx-translate';

import {GetProductMinResponse} from '../../../_shared/waiterrobot-backend';

@Component({
  template: `
    <div class="table-responsive">
      <table ngb-table [hover]="true" [dataSource]="_products" ngb-sort ngbSortActive="name" ngbSortDirection="asc">
        <ng-container ngbColumnDef="name">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAME' | tr }}</th>
          <td *ngbCellDef="let product" ngb-cell>{{ product.name }}</td>
        </ng-container>

        <ng-container ngbColumnDef="actions">
          <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | tr }}</th>
          <td *ngbCellDef="let products" ngb-cell>
            <a
              class="btn btn-sm m-1 btn-outline-primary text-white"
              routerLink="/home/products/{{ products.id }}"
              ngbTooltip="{{ 'OPEN' | tr }}"
            >
              <i-bs name="arrow-up-right-square-fill" />
            </a>
          </td>
        </ng-container>

        <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
        <tr *ngbRowDef="let product; columns: columnsToDisplay" ngb-row routerLink="/home/products/{{ product.id }}" class="clickable"></tr>
      </table>
    </div>
    <div class="w-100 text-center" *ngIf="_products.data.length < 1">
      {{ 'HOME_STATISTICS_NO_DATA' | tr }}
    </div>
  `,
  selector: 'app-printer-edit-products',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DfxTableModule, DfxTr, NgIf, RouterLink, NgbTooltip, NgxBootstrapIconsModule, DfxSortModule],
})
export class PrinterEditProductsComponent implements AfterViewInit {
  columnsToDisplay = ['name', 'actions'];
  @ViewChild(NgbSort) sort!: NgbSort;

  @Input({required: true}) set products(it: GetProductMinResponse[]) {
    this._products = new NgbTableDataSource(it);
  }

  _products!: NgbTableDataSource<GetProductMinResponse>;

  ngAfterViewInit(): void {
    this._products.sort = this.sort;
  }
}
