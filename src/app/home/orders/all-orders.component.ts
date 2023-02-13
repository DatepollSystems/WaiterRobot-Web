import {ChangeDetectionStrategy, Component} from '@angular/core';
import {OrdersService} from './orders.service';
import {GetOrderResponse} from '../../_shared/waiterrobot-backend';
import {AbstractModelsListV2Component} from '../../_shared/ui/abstract-models-list-v2.component';
import {DfxTr} from 'dfx-translate';
import {ReactiveFormsModule} from '@angular/forms';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {AsyncPipe, NgIf} from '@angular/common';
import {AppIconsModule} from '../../_shared/ui/icons.module';
import {DfxPaginationModule, DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {AppSpinnerRowComponent} from '../../_shared/ui/loading/app-spinner-row.component';

@Component({
  template: `
    <h1>{{ 'HOME_ORDERS_ALL' | tr }}</h1>

    <form>
      <div class="input-group">
        <input class="form-control ml-2 bg-dark text-white" type="text" [formControl]="filter" placeholder="{{ 'SEARCH' | tr }}" />
        <button
          class="btn btn-outline-secondary"
          type="button"
          ngbTooltip="{{ 'CLEAR' | tr }}"
          placement="bottom"
          (click)="filter.reset()"
          *ngIf="(filter?.value?.length ?? 0) > 0">
          <i-bs name="x-circle-fill"></i-bs>
        </button>
      </div>
    </form>

    <div class="table-responsive" *ngIf="dataSource$ | async as dataSource; else loading">
      <table ngb-table [hover]="true" [dataSource]="dataSource" ngb-sort ngbSortActive="id" ngbSortDirection="asc" [trackBy]="trackBy">
        <ng-container ngbColumnDef="id">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>#</th>
          <td *ngbCellDef="let order" ngb-cell>{{ order.id }}</td>
        </ng-container>

        <ng-container ngbColumnDef="orderId">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_ORDER_ID' | tr }}</th>
          <td *ngbCellDef="let order" ngb-cell>{{ order.orderId }}</td>
        </ng-container>

        <ng-container ngbColumnDef="table">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_TABLE' | tr }}</th>
          <td *ngbCellDef="let order" ngb-cell>{{ order.table.number }}</td>
        </ng-container>

        <ng-container ngbColumnDef="product">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_PROD' | tr }}</th>
          <td *ngbCellDef="let order" ngb-cell>{{ order.product.name }}</td>
        </ng-container>

        <ng-container ngbColumnDef="waiter">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_WAITERS_NAV_ORGANISATION' | tr }}</th>
          <td *ngbCellDef="let order" ngb-cell>{{ order.waiter.name }}</td>
        </ng-container>

        <ng-container ngbColumnDef="note">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_ORDER_NOTE' | tr }}</th>
          <td *ngbCellDef="let order" ngb-cell>{{ order.note }}</td>
        </ng-container>

        <ng-container ngbColumnDef="amount">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'AMOUNT' | tr }}</th>
          <td *ngbCellDef="let order" ngb-cell>{{ order.amount }}</td>
        </ng-container>

        <ng-container ngbColumnDef="printState">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'STATE' | tr }}</th>
          <td *ngbCellDef="let order" ngb-cell>{{ order.printState }}</td>
        </ng-container>

        <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
        <tr *ngbRowDef="let order; columns: columnsToDisplay" ngb-row></tr>
      </table>
      <ngb-paginator [collectionSize]="dataSource.data.length" [pageSizes]="[100, 250, 500, 1000, 2000]" [pageSize]="250"></ngb-paginator>
    </div>

    <ng-template #loading>
      <app-spinner-row></app-spinner-row>
    </ng-template>
  `,
  selector: 'app-all-orders',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    AsyncPipe,
    ReactiveFormsModule,
    DfxTr,
    NgbTooltip,
    DfxTableModule,
    DfxSortModule,
    DfxPaginationModule,
    AppIconsModule,
    AppSpinnerRowComponent,
  ],
})
export class AllOrdersComponent extends AbstractModelsListV2Component<GetOrderResponse> {
  override columnsToDisplay = ['id', 'orderId', 'table', 'product', 'waiter', 'note', 'amount', 'printState'];

  constructor(ordersService: OrdersService) {
    super(ordersService);

    this.sortingDataAccessors = new Map();
    this.sortingDataAccessors.set('table', (it) => it.table.number);
    this.sortingDataAccessors.set('product', (it) => it.product.name);
    this.sortingDataAccessors.set('waiter', (it) => it.waiter.name);
  }

  trackBy = (index: number, t: GetOrderResponse): number => t.id;
}
