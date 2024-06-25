import {AfterViewInit, ChangeDetectionStrategy, Component, Input, ViewChild} from '@angular/core';
import {RouterLink} from '@angular/router';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@jsverse/transloco';

import {GetProductMinResponse} from '@shared/waiterrobot-backend';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule, NgbSort, NgbTableDataSource} from 'dfx-bootstrap-table';

@Component({
  template: `
    <div class="table-responsive">
      <table ngb-table ngb-sort ngbSortActive="name" ngbSortDirection="asc" [hover]="true" [dataSource]="_products">
        <ng-container ngbColumnDef="name">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAME' | transloco }}</th>
          <td *ngbCellDef="let product" ngb-cell>{{ product.name }}</td>
        </ng-container>

        <ng-container ngbColumnDef="actions">
          <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | transloco }}</th>
          <td *ngbCellDef="let product" ngb-cell>
            <a
              class="btn btn-sm m-1 btn-outline-primary text-body-emphasis"
              [routerLink]="'../../products/p/' + product.id"
              [ngbTooltip]="'OPEN' | transloco"
            >
              <bi name="arrow-up-right-square-fill" />
            </a>
          </td>
        </ng-container>

        <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
        <tr
          *ngbRowDef="let product; columns: columnsToDisplay"
          ngb-row
          class="clickable"
          [routerLink]="'../../products/p/' + product.id"
        ></tr>
      </table>
    </div>
    @if (_products.data.length < 1) {
      <div class="w-100 text-center">
        {{ 'HOME_STATISTICS_NO_DATA' | transloco }}
      </div>
    }
  `,
  selector: 'app-printer-edit-products',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DfxTableModule, TranslocoPipe, RouterLink, NgbTooltip, DfxSortModule, BiComponent],
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
