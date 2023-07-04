import {AsyncPipe, DatePipe, NgIf} from '@angular/common';
import {AfterViewInit, ChangeDetectionStrategy, Component, inject, ViewChild} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {d_from, notNullAndUndefined} from 'dfts-helper';
import {DfxPaginationModule, DfxSortModule, DfxTableModule, NgbSort, NgbTableDataSource} from 'dfx-bootstrap-table';
import {NgSub} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';
import {combineLatest, debounceTime, filter, map, of, startWith, switchMap} from 'rxjs';
import {getActivatedRouteIdParam} from '../../../_shared/services/getActivatedRouteIdParam';
import {AppIconsModule} from '../../../_shared/ui/icons.module';
import {AppSpinnerRowComponent} from '../../../_shared/ui/loading/app-spinner-row.component';
import {GetOrderResponse} from '../../../_shared/waiterrobot-backend';
import {AppOrderStateBadgeComponent} from '../../orders/_components/app-order-state-badge.component';
import {OrdersService} from '../../orders/orders.service';

@Component({
  template: `
    <form>
      <div class="input-group">
        <input class="form-control ml-2 bg-dark text-white" type="text" [formControl]="searchParam$" placeholder="{{ 'SEARCH' | tr }}" />
        <button
          class="btn btn-outline-secondary"
          type="button"
          ngbTooltip="{{ 'CLEAR' | tr }}"
          placement="bottom"
          (click)="searchParam$.reset()"
          *ngIf="(searchParam$.value?.length ?? 0) > 0"
        >
          <i-bs name="x-circle-fill" />
        </button>
      </div>
    </form>

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

          <ng-container ngbColumnDef="table">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_TABLE' | tr }}</th>
            <td *ngbCellDef="let order" ngb-cell>
              <a (click)="$event.stopPropagation()" routerLink="/home/tables/groups/tables/{{ order.table.group.id }}">{{
                order.table.group.name
              }}</a>
              - <a (click)="$event.stopPropagation()" routerLink="/home/tables/{{ order.table.id }}">{{ order.table.number }}</a>
            </td>
          </ng-container>

          <ng-container ngbColumnDef="createdAt">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_ORDER_CREATED_AT' | tr }}</th>
            <td *ngbCellDef="let order" ngb-cell>{{ order.createdAt | date : 'dd.MM. HH:mm:ss' }}</td>
          </ng-container>

          <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
          <tr *ngbRowDef="let order; columns: columnsToDisplay" ngb-row routerLink="/home/orders/{{ order.id }}" class="clickable"></tr>
        </table>
      </div>
      <div class="w-100 text-center" *ngIf="dataSource.data.length < 1">
        {{ 'HOME_STATISTICS_NO_DATA' | tr }}
      </div>
    </ng-container>
  `,
  selector: 'app-waiter-edit-order-products',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AppOrderStateBadgeComponent,
    AppSpinnerRowComponent,
    DatePipe,
    DfxPaginationModule,
    DfxSortModule,
    DfxTableModule,
    DfxTr,
    RouterLink,
    AsyncPipe,
    NgIf,
    NgSub,
    FormsModule,
    NgbTooltip,
    ReactiveFormsModule,
    AppIconsModule,
  ],
})
export class WaiterEditOrderProductsComponent implements AfterViewInit {
  ordersService = inject(OrdersService);
  dataSource$ = of(new NgbTableDataSource<GetOrderResponse>());

  columnsToDisplay = ['orderNumber', 'state', 'table', 'createdAt'];

  @ViewChild(NgbSort) sort!: NgbSort;
  public searchParam$ = new FormControl('');

  idParam$ = getActivatedRouteIdParam();

  ngAfterViewInit() {
    this.dataSource$ = combineLatest([
      this.searchParam$.valueChanges.pipe(
        startWith(''),
        map((it) => it ?? ''),
        debounceTime(250)
      ),
      this.idParam$.pipe(
        filter(notNullAndUndefined),
        switchMap((id) => this.ordersService.getByWaiterId$(id))
      ),
    ]).pipe(
      map(([searchParam, orders]) => {
        const dataSource = new NgbTableDataSource(orders);
        dataSource.sortingDataAccessor = (item, property: string) => {
          switch (property) {
            case 'table':
              return `${item.table.group.name} ${item.table.number}`;
            case 'createdAt':
              return d_from(item.createdAt).getTime();
            default:
              return item[property as keyof GetOrderResponse] as string | number;
          }
        };
        dataSource.filter = searchParam;
        dataSource.sort = this.sort;
        return dataSource;
      })
    );
  }
}
