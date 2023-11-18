import {DatePipe} from '@angular/common';
import {AfterViewInit, ChangeDetectionStrategy, Component, inject, ViewChild} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

import {debounceTime, filter, tap} from 'rxjs';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {notNullAndUndefined} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxPaginationModule, DfxSortModule, DfxTableModule, NgbPaginator, NgbSort} from 'dfx-bootstrap-table';
import {DfxTr} from 'dfx-translate';

import {PaginatedDataSource} from '../../../_shared/paginated-data-source';
import {getActivatedRouteIdParam} from '../../../_shared/services/getActivatedRouteIdParam';
import {AppSpinnerRowComponent} from '../../../_shared/ui/loading/app-spinner-row.component';
import {GetOrderMinResponse} from '../../../_shared/waiterrobot-backend';
import {AppOrderStateBadgeComponent} from '../../orders/_components/app-order-state-badge.component';
import {OrdersService} from '../../orders/orders.service';

@Component({
  template: `
    <form class="my-2">
      <div class="input-group">
        <input class="form-control ml-2" type="text" [formControl]="filter" placeholder="{{ 'SEARCH' | tr }}" />
        @if ((filter.value?.length ?? 0) > 0) {
          <button
            class="btn btn-outline-secondary"
            type="button"
            ngbTooltip="{{ 'CLEAR' | tr }}"
            placement="bottom"
            (click)="filter.reset()"
          >
            <bi name="x-circle-fill" />
          </button>
        }
      </div>
    </form>

    <div class="table-responsive">
      <table ngb-table [hover]="true" [dataSource]="dataSource" ngb-sort ngbSortActive="createdAt" ngbSortDirection="desc">
        <ng-container ngbColumnDef="orderNumber">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_ORDER_NUMBER' | tr }}</th>
          <td *ngbCellDef="let order" ngb-cell>{{ order.orderNumber }}</td>
        </ng-container>

        <ng-container ngbColumnDef="state">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'STATE' | tr }}</th>
          <td *ngbCellDef="let order" ngb-cell>
            <app-order-state-badge
              [orderState]="order.state"
              [orderProductPrintStates]="order.orderProductPrintStates"
              [processedAt]="order.processedAt"
              [createdAt]="order.createdAt"
            />
          </td>
        </ng-container>

        <ng-container ngbColumnDef="waiter.name">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_WAITERS_NAV_ORGANISATION' | tr }}</th>
          <td *ngbCellDef="let order" ngb-cell>
            <a (click)="$event.stopPropagation()" routerLink="../../waiters/{{ order.waiter.id }}">{{ order.waiter.name }}</a>
          </td>
        </ng-container>

        <ng-container ngbColumnDef="createdAt">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_ORDER_CREATED_AT' | tr }}</th>
          <td *ngbCellDef="let order" ngb-cell>{{ order.createdAt | date: 'dd.MM.yy HH:mm:ss' }}</td>
        </ng-container>

        <ng-container ngbColumnDef="actions">
          <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | tr }}</th>
          <td *ngbCellDef="let order" ngb-cell>
            <a
              class="btn btn-sm m-1 btn-outline-primary text-body-emphasis"
              routerLink="../../orders/{{ order.id }}"
              ngbTooltip="{{ 'OPEN' | tr }}"
            >
              <bi name="arrow-up-right-square-fill" />
            </a>
          </td>
        </ng-container>

        <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
        <tr *ngbRowDef="let order; columns: columnsToDisplay" ngb-row routerLink="../../orders/{{ order.id }}" class="clickable"></tr>
      </table>
    </div>

    @if ((dataSource.data?.numberOfItems ?? 1) < 1) {
      <div class="w-100 text-center">
        {{ 'HOME_STATISTICS_NO_DATA' | tr }}
      </div>
    }

    @if (!dataSource.data) {
      <app-spinner-row />
    }

    <ngb-paginator [collectionSize]="dataSource.data?.numberOfItems ?? 0" [pageSizes]="[10, 20, 50, 100, 200]" [pageSize]="50" />
  `,
  selector: 'app-table-edit-order-products',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    DatePipe,
    RouterLink,
    DfxPaginationModule,
    DfxTableModule,
    DfxTr,
    DfxSortModule,
    NgbTooltip,
    BiComponent,
    AppOrderStateBadgeComponent,
    AppSpinnerRowComponent,
  ],
})
export class TableEditOrderProductsComponent implements AfterViewInit {
  ordersService = inject(OrdersService);

  @ViewChild(NgbSort) sort?: NgbSort;
  @ViewChild(NgbPaginator, {static: true}) paginator!: NgbPaginator;
  dataSource = new PaginatedDataSource<GetOrderMinResponse>(
    this.ordersService.getPaginatedFnByTableIdId(getActivatedRouteIdParam().pipe(filter(notNullAndUndefined))),
  );
  filter = new FormControl<string>('');
  columnsToDisplay = ['orderNumber', 'state', 'waiter.name', 'createdAt', 'actions'];

  constructor() {
    this.filter.valueChanges
      .pipe(
        takeUntilDestroyed(),
        debounceTime(700),
        tap((it) => {
          this.dataSource.filter = it ?? '';
        }),
      )
      .subscribe();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
