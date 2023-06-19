import {AsyncPipe, DatePipe, NgClass, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {DfxPaginationModule, DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxCutPipe, DfxImplodePipe, NgSub} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';
import {AbstractModelsListComponent} from '../../_shared/ui/abstract-models-list.component';
import {AppIconsModule} from '../../_shared/ui/icons.module';
import {AppSpinnerRowComponent} from '../../_shared/ui/loading/app-spinner-row.component';
import {DfxArrayPluck} from '../../_shared/ui/pluck.pipe';
import {GetOrderResponse} from '../../_shared/waiterrobot-backend';
import {AppOrderCountdownComponent} from './_components/app-order-countdown.component';
import {AppOrderStateBadgeComponent} from './_components/app-order-state-badge.component';
import {OrdersService} from './orders.service';

@Component({
  template: `
    <div class="d-flex align-items-center justify-content-between">
      <h1>{{ 'HOME_ORDERS_ALL' | tr }}</h1>
      <app-order-countdown [countdown]="(countdown$ | async) ?? 0" />
    </div>

    <form class="mt-2">
      <div class="input-group">
        <input class="form-control ml-2 bg-dark text-white" type="text" [formControl]="filter" placeholder="{{ 'SEARCH' | tr }}" />
        <button
          class="btn btn-outline-secondary"
          type="button"
          ngbTooltip="{{ 'CLEAR' | tr }}"
          placement="bottom"
          (click)="filter.reset()"
          *ngIf="(filter?.value?.length ?? 0) > 0"
        >
          <i-bs name="x-circle-fill" />
        </button>
      </div>
    </form>

    <ng-container *ngSub="dataSource$ as dataSource">
      <div class="table-responsive">
        <table
          ngb-table
          [hover]="true"
          [dataSource]="dataSource"
          ngb-sort
          ngbSortActive="createdAt"
          ngbSortDirection="asc"
          [trackBy]="trackBy"
        >
          <ng-container ngbColumnDef="orderNumber">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>#</th>
            <td *ngbCellDef="let order" ngb-cell>{{ order.orderNumber }}</td>
          </ng-container>

          <ng-container ngbColumnDef="table">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_TABLE' | tr }}</th>
            <td *ngbCellDef="let order" ngb-cell>
              <a (click)="$event.stopPropagation()" routerLink="/home/tables/groups/tables/{{ order.table.group.id }}">{{
                order.table.group.name
              }}</a>
              - <a (click)="$event.stopPropagation()" routerLink="/home/tables/{{ order.table.id }}">{{ order.table.number }}</a>
            </td>
          </ng-container>

          <ng-container ngbColumnDef="waiter">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_WAITERS_NAV_ORGANISATION' | tr }}</th>
            <td *ngbCellDef="let order" ngb-cell>
              <a (click)="$event.stopPropagation()" routerLink="/home/waiters/{{ order.waiter.id }}">{{ order.waiter.name }}</a>
            </td>
          </ng-container>

          <ng-container ngbColumnDef="state">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'STATE' | tr }}</th>
            <td *ngbCellDef="let order" ngb-cell>
              <app-order-state-badge [orderState]="order.state" />
            </td>
          </ng-container>

          <ng-container ngbColumnDef="products">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_PROD_ALL' | tr }}</th>
            <td *ngbCellDef="let order" ngb-cell>
              {{ order.orderProducts | a_pluck : 'product' | a_pluck : 'name' | s_implode : ', ' | s_cut : 30 }}
            </td>
          </ng-container>

          <ng-container ngbColumnDef="createdAt">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_ORDER_CREATED_AT' | tr }}</th>
            <td *ngbCellDef="let order" ngb-cell>{{ order.createdAt | date : 'HH:mm:ss' }}</td>
          </ng-container>

          <ng-container ngbColumnDef="processedAt">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_ORDER_PROCESSED_AT' | tr }}</th>
            <td *ngbCellDef="let order" ngb-cell>{{ order.processedAt | date : 'HH:mm:ss' }}</td>
          </ng-container>

          <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
          <tr *ngbRowDef="let order; columns: columnsToDisplay" ngb-row routerLink="../{{ order.id }}"></tr>
        </table>
      </div>

      <app-spinner-row [show]="isLoading" />

      <ngb-paginator [collectionSize]="dataSource.data.length" [pageSizes]="[100, 250, 500, 1000, 2000]" [pageSize]="250" />
    </ng-container>
  `,
  selector: 'app-all-orders',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    NgClass,
    DatePipe,
    AsyncPipe,
    ReactiveFormsModule,
    NgbTooltip,
    NgSub,
    DfxTableModule,
    DfxSortModule,
    DfxPaginationModule,
    DfxArrayPluck,
    DfxImplodePipe,
    DfxCutPipe,
    DfxTr,
    AppIconsModule,
    AppSpinnerRowComponent,
    RouterLink,
    AppOrderStateBadgeComponent,
    AppOrderCountdownComponent,
  ],
})
export class AllOrdersComponent extends AbstractModelsListComponent<GetOrderResponse> {
  constructor(private ordersService: OrdersService) {
    super(ordersService);

    this.columnsToDisplay = ['orderNumber', 'table', 'waiter', 'products', 'state', 'createdAt', 'processedAt'];

    this.sortingDataAccessors = new Map();
    this.sortingDataAccessors.set('table', (it) => it.table.number);
    this.sortingDataAccessors.set('waiter', (it) => it.waiter.name);
    this.sortingDataAccessors.set('createdAt', (it) => new Date(it.createdAt).getTime());
    this.sortingDataAccessors.set('processedAt', (it) => (it.processedAt ? new Date(it.processedAt).getTime() : 0));
  }

  trackBy = (index: number, t: GetOrderResponse): number => t.id;
  countdown$ = this.ordersService.countdown$();
}
