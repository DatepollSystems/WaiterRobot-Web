import {AsyncPipe, DatePipe, NgIf} from '@angular/common';
import {AfterViewInit, ChangeDetectionStrategy, Component, inject, ViewChild} from '@angular/core';
import {RouterLink} from '@angular/router';
import {d_from, notNullAndUndefined} from 'dfts-helper';
import {DfxPaginationModule, DfxSortModule, DfxTableModule, NgbSort, NgbTableDataSource} from 'dfx-bootstrap-table';
import {DfxCutPipe, DfxImplodePipe, NgSub} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';
import {filter, map, of, switchMap} from 'rxjs';
import {getActivatedRouteIdParam} from '../../../_shared/services/getActivatedRouteIdParam';
import {AppSpinnerRowComponent} from '../../../_shared/ui/loading/app-spinner-row.component';
import {DfxArrayPluck} from '../../../_shared/ui/pluck.pipe';
import {GetOrderResponse} from '../../../_shared/waiterrobot-backend';
import {AppOrderStateBadgeComponent} from '../../orders/_components/app-order-state-badge.component';
import {OrdersService} from '../../orders/orders.service';

@Component({
  template: `
    <ng-container *ngSub="dataSource$ as dataSource">
      <div class="table-responsive">
        <table ngb-table [hover]="true" [dataSource]="dataSource" ngb-sort ngbSortActive="createdAt" ngbSortDirection="asc">
          <ng-container ngbColumnDef="orderNumber">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>#</th>
            <td *ngbCellDef="let order" ngb-cell>{{ order.orderNumber }}</td>
          </ng-container>

          <ng-container ngbColumnDef="state">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'STATE' | tr }}</th>
            <td *ngbCellDef="let order" ngb-cell>
              <app-order-state-badge [orderState]="order.state" [processedAt]="order.processedAt" />
            </td>
          </ng-container>

          <ng-container ngbColumnDef="waiter">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_WAITERS_NAV_ORGANISATION' | tr }}</th>
            <td *ngbCellDef="let order" ngb-cell>
              <a (click)="$event.stopPropagation()" routerLink="/home/waiters/{{ order.waiter.id }}">{{ order.waiter.name }}</a>
            </td>
          </ng-container>

          <ng-container ngbColumnDef="products">
            <th *ngbHeaderCellDef ngb-header-cell>{{ 'HOME_PROD_ALL' | tr }}</th>
            <td *ngbCellDef="let order" ngb-cell>
              {{ order.orderProducts | a_pluck : 'product' | a_pluck : 'name' | s_implode : ', ' | s_cut : 30 }}
            </td>
          </ng-container>

          <ng-container ngbColumnDef="createdAt">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_ORDER_CREATED_AT' | tr }}</th>
            <td *ngbCellDef="let order" ngb-cell>{{ order.createdAt | date : 'dd.MM. HH:mm:ss' }}</td>
          </ng-container>

          <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
          <tr *ngbRowDef="let order; columns: columnsToDisplay" ngb-row routerLink="/home/orders/{{ order.id }}"></tr>
        </table>
      </div>
      <div class="w-100 text-center" *ngIf="dataSource.data.length < 1">
        {{ 'HOME_STATISTICS_NO_DATA' | tr }}
      </div>
    </ng-container>
  `,
  selector: 'app-table-edit-order-products',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AppOrderStateBadgeComponent,
    AppSpinnerRowComponent,
    DatePipe,
    DfxArrayPluck,
    DfxCutPipe,
    DfxImplodePipe,
    DfxPaginationModule,
    DfxSortModule,
    DfxTableModule,
    DfxTr,
    RouterLink,
    AsyncPipe,
    NgIf,
    NgSub,
  ],
})
export class TableEditOrderProductsComponent implements AfterViewInit {
  ordersService = inject(OrdersService);
  dataSource$ = of(new NgbTableDataSource<GetOrderResponse>());

  columnsToDisplay = ['orderNumber', 'state', 'waiter', 'products', 'createdAt'];

  @ViewChild(NgbSort) sort!: NgbSort;

  idParam$ = getActivatedRouteIdParam();

  ngAfterViewInit() {
    this.dataSource$ = this.idParam$.pipe(
      filter(notNullAndUndefined),
      switchMap((id) => this.ordersService.getByTableId(id)),
      map((orders) => {
        const dataSource = new NgbTableDataSource(orders);
        dataSource.sortingDataAccessor = (item, property: string) => {
          switch (property) {
            case 'waiter':
              return item.waiter.name;
            case 'createdAt':
              return d_from(item.createdAt).getTime();
            case 'processedAt':
              return d_from(item.processedAt).getTime();
            default:
              return item[property as keyof GetOrderResponse] as string | number;
          }
        };
        dataSource.sort = this.sort;
        return dataSource;
      })
    );
  }
}
