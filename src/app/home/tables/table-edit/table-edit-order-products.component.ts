import {AsyncPipe, DatePipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {notNullAndUndefined} from 'dfts-helper';
import {DfxPaginationModule, DfxTableModule, NgbTableDataSource} from 'dfx-bootstrap-table';
import {NgSub} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';
import {combineLatest, debounceTime, filter, map, startWith, switchMap} from 'rxjs';
import {getActivatedRouteIdParam} from '../../../_shared/services/getActivatedRouteIdParam';
import {AppIconsModule} from '../../../_shared/ui/icons.module';
import {AppOrderStateBadgeComponent} from '../../orders/_components/app-order-state-badge.component';
import {OrdersService} from '../../orders/orders.service';

@Component({
  template: `
    <form class="my-2">
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

    <div class="table-responsive">
      <table ngb-table [hover]="true" [dataSource]="(dataSource$ | async) ?? []">
        <ng-container ngbColumnDef="orderNumber">
          <th *ngbHeaderCellDef ngb-header-cell>{{ 'HOME_ORDER_NUMBER' | tr }}</th>
          <td *ngbCellDef="let order" ngb-cell>{{ order.orderNumber }}</td>
        </ng-container>

        <ng-container ngbColumnDef="state">
          <th *ngbHeaderCellDef ngb-header-cell>{{ 'STATE' | tr }}</th>
          <td *ngbCellDef="let order" ngb-cell>
            <app-order-state-badge
              [orderState]="order.state"
              [orderProductStates]="order.orderProductStates"
              [processedAt]="order.processedAt"
              [createdAt]="order.createdAt"
            />
          </td>
        </ng-container>

        <ng-container ngbColumnDef="waiter">
          <th *ngbHeaderCellDef ngb-header-cell>{{ 'HOME_WAITERS_NAV_ORGANISATION' | tr }}</th>
          <td *ngbCellDef="let order" ngb-cell>
            <a (click)="$event.stopPropagation()" routerLink="/home/waiters/{{ order.waiter.id }}">{{ order.waiter.name }}</a>
          </td>
        </ng-container>

        <ng-container ngbColumnDef="createdAt">
          <th *ngbHeaderCellDef ngb-header-cell>{{ 'HOME_ORDER_CREATED_AT' | tr }}</th>
          <td *ngbCellDef="let order" ngb-cell>{{ order.createdAt | date: 'dd.MM. HH:mm:ss' }}</td>
        </ng-container>

        <ng-container ngbColumnDef="actions">
          <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | tr }}</th>
          <td *ngbCellDef="let order" ngb-cell>
            <a
              class="btn btn-sm m-1 btn-outline-primary text-white"
              routerLink="/home/orders/{{ order.id }}"
              ngbTooltip="{{ 'OPEN' | tr }}"
            >
              <i-bs name="arrow-up-right-square-fill" />
            </a>
          </td>
        </ng-container>

        <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
        <tr *ngbRowDef="let order; columns: columnsToDisplay" ngb-row routerLink="/home/orders/{{ order.id }}" class="clickable"></tr>

        <tr *ngbNoDataRow>
          <div class="w-100 text-center">
            {{ 'HOME_STATISTICS_NO_DATA' | tr }}
          </div>
        </tr>
      </table>
    </div>
  `,
  selector: 'app-table-edit-order-products',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AppOrderStateBadgeComponent,
    DatePipe,
    DfxPaginationModule,
    DfxTableModule,
    DfxTr,
    RouterLink,
    NgIf,
    NgSub,
    NgbTooltip,
    ReactiveFormsModule,
    AppIconsModule,
    AsyncPipe,
  ],
})
export class TableEditOrderProductsComponent {
  ordersService = inject(OrdersService);

  columnsToDisplay = ['orderNumber', 'state', 'waiter', 'createdAt', 'actions'];

  public searchParam$ = new FormControl('');

  dataSource$ = combineLatest([
    this.searchParam$.valueChanges.pipe(
      startWith(''),
      map((it) => it ?? ''),
      debounceTime(250),
    ),
    getActivatedRouteIdParam().pipe(
      filter(notNullAndUndefined),
      switchMap((id) => this.ordersService.getByTableId$(id)),
    ),
  ]).pipe(
    map(([searchParam, orders]) => {
      const dataSource = new NgbTableDataSource(orders);
      dataSource.filter = searchParam;
      return dataSource;
    }),
  );
}
