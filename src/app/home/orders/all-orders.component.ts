import {SelectionModel} from '@angular/cdk/collections';
import {AsyncPipe, DatePipe} from '@angular/common';
import {AfterViewInit, ChangeDetectionStrategy, Component, inject, ViewChild} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

import {debounceTime, forkJoin, map, merge, Observable, pipe, switchMap, tap} from 'rxjs';

import {NgbProgressbar, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {Download} from 'src/app/_shared/services/download.service';
import {computedFrom} from 'ngxtension/computed-from';

import {loggerOf, s_imploder} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxPaginationModule, DfxSortModule, DfxTableModule, NgbPaginator, NgbSort} from 'dfx-bootstrap-table';
import {DfxTr} from 'dfx-translate';

import {AppTestBadge} from '../../_shared/ui/app-test-badge.component';
import {ScrollableToolbarComponent} from '../../_shared/ui/button/scrollable-toolbar.component';
import {AppSpinnerRowComponent} from '../../_shared/ui/loading/app-spinner-row.component';
import {injectConfirmDialog} from '../../_shared/ui/question-dialog/question-dialog.component';
import {GetOrderMinResponse} from '../../_shared/waiterrobot-backend';
import {AppOrderRefreshButtonComponent} from './_components/app-order-refresh-button.component';
import {AppOrderStateBadgeComponent} from './_components/app-order-state-badge.component';
import {OrdersService} from './orders.service';
import {getSortParam, injectPagination} from '../../_shared/services/pagination';
import {AppProgressBarComponent} from '../../_shared/ui/loading/app-progress-bar.component';

@Component({
  template: `
    <div class="d-flex align-items-center justify-content-between">
      <h1>{{ 'HOME_ORDERS_ALL' | tr }}</h1>
      <app-order-refresh-btn />
    </div>

    <scrollable-toolbar>
      <div>
        <button class="btn btn-sm btn-info" (click)="exportCsv()">
          <bi name="filetype-csv" />
          {{ 'EXPORT' | tr }}
        </button>
      </div>

      <div>
        <button class="btn btn-sm btn-warning" (click)="requeueOrders()" [class.disabled]="!selection.hasValue()">
          <bi name="printer" />
          {{ 'HOME_ORDER_REQUEUE' | tr }}
        </button>
      </div>
      <div>
        <button class="btn btn-sm btn-warning" (click)="printAllTest()" ngbTooltip="Beinhaltet alle Produkte">
          <bi name="bug" />
          {{ 'Testbestellung aufgeben' | tr }}
        </button>
      </div>
    </scrollable-toolbar>

    @if (download$ | async; as download) {
      @if (download.state !== 'DONE') {
        <ngb-progressbar
          type="success"
          [showValue]="download.state !== 'PENDING'"
          [striped]="download.state === 'PENDING'"
          [value]="download.progress"
        />
      }
    }

    <div class="table-responsive">
      <table
        ngb-table
        [hover]="true"
        [dataSource]="dataSource()"
        ngb-sort
        [ngbSortActive]="pagination.params().sort"
        [ngbSortDirection]="pagination.params().direction"
      >
        <ng-container ngbColumnDef="select">
          <th *ngbHeaderCellDef ngb-header-cell></th>
          <td *ngbCellDef="let selectable" ngb-cell>
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                name="checked"
                (click)="$event.stopPropagation()"
                (change)="$event ? selection.toggle(selectable) : null"
                [checked]="selection.isSelected(selectable)"
              />
            </div>
          </td>
        </ng-container>

        <ng-container ngbColumnDef="orderNumber">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_ORDER_NUMBER' | tr }}</th>
          <td *ngbCellDef="let order" ngb-cell>{{ order.orderNumber }}</td>
        </ng-container>

        <ng-container ngbColumnDef="table.tableGroup.name">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_ORDER_TABLE' | tr }}</th>
          <td *ngbCellDef="let order" ngb-cell>
            <a (click)="$event.stopPropagation()" routerLink="../../tables/groups/tables/{{ order.table.group.id }}">{{
              order.table.group.name
            }}</a>
            - <a (click)="$event.stopPropagation()" routerLink="../../tables/{{ order.table.id }}">{{ order.table.number }}</a>
          </td>
        </ng-container>

        <ng-container ngbColumnDef="waiter.name">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_WAITERS_NAV_ORGANISATION' | tr }}</th>
          <td *ngbCellDef="let order" ngb-cell>
            <a (click)="$event.stopPropagation()" routerLink="../../waiters/{{ order.waiter.id }}">{{ order.waiter.name }}</a>
          </td>
        </ng-container>

        <ng-container ngbColumnDef="state">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'STATE' | tr }}</th>
          <td *ngbCellDef="let order" ngb-cell>
            <div class="d-flex align-items-center gap-2">
              <app-order-state-badge
                [orderState]="order.state"
                [orderProductPrintStates]="order.orderProductPrintStates"
                [createdAt]="order.createdAt"
                [processedAt]="order.processedAt"
              />

              @if (order.test) {
                <app-test-badge />
              }
            </div>
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
              routerLink="../{{ order.id }}"
              ngbTooltip="{{ 'OPEN' | tr }}"
              placement="left"
            >
              <bi name="arrow-up-right-square-fill" />
            </a>
            <button
              class="btn btn-sm m-1 btn-warning"
              (click)="$event.stopPropagation(); requeueOrder(order)"
              ngbTooltip="{{ 'HOME_ORDER_REQUEUE' | tr }}"
              placement="bottom"
            >
              <bi name="printer" />
            </button>
          </td>
        </ng-container>

        <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
        <tr *ngbRowDef="let order; columns: columnsToDisplay" ngb-row routerLink="../{{ order.id }}"></tr>
      </table>

      <app-progress-bar [hidden]="!pagination.loading()" />
    </div>

    @if (!pagination.loading() && dataSource().length < 1) {
      <div class="w-100 text-center mt-2">
        {{ 'HOME_STATISTICS_NO_DATA' | tr }}
      </div>
    }

    <ngb-paginator
      [length]="pagination.totalElements()"
      [pageSize]="pagination.params().size"
      [pageSizeOptions]="[10, 20, 50, 100, 200]"
      [pageIndex]="pagination.params().page"
      showFirstLastButtons
    />
  `,
  selector: 'app-all-orders',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    DatePipe,
    AsyncPipe,
    ReactiveFormsModule,
    NgbTooltip,
    NgbProgressbar,
    DfxTableModule,
    DfxSortModule,
    DfxPaginationModule,
    DfxTr,
    BiComponent,
    AppOrderStateBadgeComponent,
    AppOrderRefreshButtonComponent,
    ScrollableToolbarComponent,
    AppSpinnerRowComponent,
    AppTestBadge,
    AppProgressBarComponent,
  ],
})
export class AllOrdersComponent implements AfterViewInit {
  private confirmDialog = injectConfirmDialog();
  ordersService = inject(OrdersService);

  pagination = injectPagination('createdAt', 'desc');

  lumber = loggerOf('AllOrders');

  @ViewChild(NgbSort) sort!: NgbSort;
  @ViewChild(NgbPaginator) paginator!: NgbPaginator;

  columnsToDisplay = ['select', 'orderNumber', 'state', 'table.tableGroup.name', 'waiter.name', 'createdAt', 'actions'];
  selection = new SelectionModel<GetOrderMinResponse>(true, [], false, (a, b) => a.id === b.id);

  download$?: Observable<Download>;

  dataSource = computedFrom(
    [this.pagination.params],
    pipe(
      debounceTime(350),
      tap(() => this.pagination.loading.set(true)),
      switchMap(([options]) =>
        this.ordersService.getAllPaginated({
          page: options.page,
          size: options.size,
          sort: getSortParam(options.sort, options.direction),
        }),
      ),
      tap(() => this.pagination.loading.set(false)),
      tap((it) => this.pagination.totalElements.set(it.numberOfItems)),
      map((it) => it.data),
    ),
    {initialValue: []},
  );

  ngAfterViewInit(): void {
    merge(this.paginator.page, this.sort.sortChange).subscribe(() =>
      this.pagination.updateParams({
        size: this.paginator.pageSize,
        page: this.paginator.pageIndex,
        sort: this.sort.active,
        direction: this.sort.direction,
      }),
    );
  }

  exportCsv(): void {
    this.download$ = this.ordersService.download$();
  }

  printAllTest(): void {
    void this.confirmDialog('Testbestellung aufgeben?').then((result) => {
      if (result) {
        this.ordersService.printAllTest();
      }
    });
  }

  requeueOrder(it: GetOrderMinResponse): void {
    this.selection.clear();
    this.selection.toggle(it);
    this.requeueOrders();
  }

  requeueOrders(): void {
    this.lumber.info('requeueOrders', 'Opening requeue question dialog');
    this.lumber.info('requeueOrders', 'Selected entities:', this.selection.selected);
    const selected = this.selection.selected.slice();
    void this.confirmDialog(
      'HOME_ORDER_REQUEUE',
      `<ol><li>${s_imploder()
        .mappedSource(selected, (it) => it.orderNumber)
        .separator('</li><li>')
        .build()}</li></ol>`,
    ).then((result) => {
      if (result) {
        const observables: Observable<unknown>[] = [];
        for (const it of selected) {
          observables.push(this.ordersService.requeueOrder$(it.id));
        }
        forkJoin(observables).subscribe();
      }
    });
  }
}
