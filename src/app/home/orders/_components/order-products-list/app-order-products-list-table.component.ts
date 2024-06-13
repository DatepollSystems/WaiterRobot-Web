import {booleanAttribute, ChangeDetectionStrategy, Component, input, Input, viewChild} from '@angular/core';
import {toObservable} from '@angular/core/rxjs-interop';
import {RouterLink} from '@angular/router';
import {injectTable} from '@home-shared/list';
import {TranslocoPipe} from '@jsverse/transloco';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {DfxSortModule, DfxTableModule, NgbSort} from 'dfx-bootstrap-table';

import {GetImplodedOrderProductResponse} from 'src/app/_shared/waiterrobot-backend';

import {AppOrderProductStateBadgeComponent} from '../app-order-product-state-badge.component';

@Component({
  template: `
    <div class="table-responsive">
      <table ngb-table ngb-sort ngbSortActive="product" ngbSortDirection="asc" [hover]="true" [dataSource]="table.dataSource()">
        <ng-container ngbColumnDef="product">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_PROD' | transloco }}</th>
          <td *ngbCellDef="let order" ngb-cell>
            <div class="d-flex align-items-center gap-2">
              <span class="badge rounded-pill text-bg-info" [ngbTooltip]="'AMOUNT' | transloco">{{ order.amount }}x</span>
              <a [routerLink]="'../../products/p/' + order.product.id">
                {{ order.product.name }}
              </a>
            </div>
          </td>
        </ng-container>

        <ng-container ngbColumnDef="note">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_ORDER_NOTE' | transloco }}</th>
          <td *ngbCellDef="let order" ngb-cell>
            <code>{{ order.note }}</code>
          </td>
        </ng-container>

        <ng-container ngbColumnDef="printState">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'STATE' | transloco }}</th>
          <td *ngbCellDef="let order" ngb-cell>
            <app-order-product-state-badge
              [printState]="order.printState"
              [sentToPrinterAt]="order.sentToPrinterAt"
              [printedAt]="order.printedAt"
            />
          </td>
        </ng-container>

        <ng-container ngbColumnDef="printedBy">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAV_PRINTERS' | transloco }}</th>
          <td *ngbCellDef="let order" ngb-cell>
            <a [routerLink]="'../../printers/' + order.printedBy.id">
              {{ order.printedBy.name }}
            </a>
          </td>
        </ng-container>

        <tr *ngbHeaderRowDef="table.columnsToDisplay()" ngb-header-row></tr>
        <tr *ngbRowDef="let order; columns: table.columnsToDisplay()" ngb-row></tr>
      </table>
    </div>
  `,
  standalone: true,
  selector: 'app-order-products-list-table',
  imports: [DfxSortModule, DfxTableModule, TranslocoPipe, AppOrderProductStateBadgeComponent, RouterLink, NgbTooltip],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppOrderProductsListTableComponent {
  orderProducts = input.required<GetImplodedOrderProductResponse[]>();
  orderProducts$ = toObservable(this.orderProducts);

  sort = viewChild(NgbSort);
  table = injectTable({
    columnsToDisplay: ['product', 'note', 'printState', 'printedBy'],
    fetchData: () => this.orderProducts$,
    sort: this.sort,
    sortingDataAccessors: {
      product: (it) => it.product.name,
      printedBy: (it) => it.printedBy.name,
    },
  });

  @Input({transform: booleanAttribute})
  set hidePrintedBy(it: boolean) {
    if (it) {
      this.table.columnsToDisplay.update((columns) => {
        columns.pop();
        return [...columns];
      });
    }
  }
}
