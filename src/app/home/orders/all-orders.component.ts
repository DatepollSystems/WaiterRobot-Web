import {SelectionModel} from '@angular/cdk/collections';
import {AsyncPipe, DatePipe, NgIf} from '@angular/common';
import {AfterViewInit, ChangeDetectionStrategy, Component, inject, ViewChild} from '@angular/core';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';

import {debounceTime, forkJoin, map, Observable, shareReplay, tap} from 'rxjs';

import {NgbProgressbar, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {SortDirection} from 'dfx-bootstrap-table/lib/sort/sort-direction';
import {Download} from 'src/app/_shared/services/download.service';

import {loggerOf, n_from, s_imploder} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxPaginationModule, DfxSortModule, DfxTableModule, NgbPaginator, NgbSort} from 'dfx-bootstrap-table';
import {DfxTr} from 'dfx-translate';

import {PaginatedDataSource} from '../../_shared/paginated-data-source';
import {ScrollableToolbarComponent} from '../../_shared/ui/button/scrollable-toolbar.component';
import {AppSpinnerRowComponent} from '../../_shared/ui/loading/app-spinner-row.component';
import {injectConfirmDialog} from '../../_shared/ui/question-dialog/question-dialog.component';
import {GetOrderMinResponse} from '../../_shared/waiterrobot-backend';
import {AppOrderRefreshButtonComponent} from './_components/app-order-refresh-button.component';
import {AppOrderStateBadgeComponent} from './_components/app-order-state-badge.component';
import {OrdersService} from './orders.service';

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
        <button class="btn btn-sm btn-warning" (click)="printAllTest()">
          <bi name="printer" />
          {{ 'PRINT ALL' | tr }}
        </button>
      </div>
    </scrollable-toolbar>

    <ng-container *ngIf="download$ | async as download">
      <ngb-progressbar
        type="success"
        *ngIf="download.state !== 'DONE'"
        [showValue]="download.state !== 'PENDING'"
        [striped]="download.state === 'PENDING'"
        [value]="download.progress"
      />
    </ng-container>

    <form class="mt-2">
      <div class="input-group">
        <input class="form-control ml-2" type="text" [formControl]="filter" placeholder="{{ 'SEARCH' | tr }}" />
        <button
          class="btn btn-outline-secondary"
          type="button"
          ngbTooltip="{{ 'CLEAR' | tr }}"
          placement="bottom"
          (click)="filter.reset()"
          *ngIf="(filter.value?.length ?? 0) > 0"
        >
          <bi name="x-circle-fill" />
        </button>
      </div>
    </form>

    <div class="table-responsive">
      <table
        ngb-table
        [hover]="true"
        [dataSource]="dataSource"
        ngb-sort
        [ngbSortActive]="tableOptions().sort"
        [ngbSortDirection]="tableOptions().direction"
        (ngbSortChange)="updateQueryParams()"
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
            <a (click)="$event.stopPropagation()" routerLink="/home/tables/groups/tables/{{ order.table.group.id }}">{{
              order.table.group.name
            }}</a>
            - <a (click)="$event.stopPropagation()" routerLink="/home/tables/{{ order.table.id }}">{{ order.table.number }}</a>
          </td>
        </ng-container>

        <ng-container ngbColumnDef="waiter.name">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_WAITERS_NAV_ORGANISATION' | tr }}</th>
          <td *ngbCellDef="let order" ngb-cell>
            <a (click)="$event.stopPropagation()" routerLink="/home/waiters/{{ order.waiter.id }}">{{ order.waiter.name }}</a>
          </td>
        </ng-container>

        <ng-container ngbColumnDef="state">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'STATE' | tr }}</th>
          <td *ngbCellDef="let order" ngb-cell>
            <app-order-state-badge
              [orderState]="order.state"
              [orderProductPrintStates]="order.orderProductPrintStates"
              [createdAt]="order.createdAt"
              [processedAt]="order.processedAt"
            />
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
              routerLink="/home/orders/{{ order.id }}"
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
        <tr *ngbRowDef="let order; columns: columnsToDisplay" ngb-row routerLink="/home/orders/{{ order.id }}"></tr>
      </table>
    </div>

    <div class="w-100 text-center" *ngIf="(dataSource.data?.numberOfItems ?? 1) < 1">
      {{ 'HOME_STATISTICS_NO_DATA' | tr }}
    </div>

    <app-spinner-row *ngIf="!dataSource.data" />

    <!-- Set collection size  -->
    <ngb-paginator
      [collectionSize]="dataSource.data?.numberOfItems ?? 1000000000"
      [pageSize]="tableOptions().pageSize"
      [pageSizes]="[10, 20, 50, 100, 200]"
      [page]="tableOptions().page"
      (pageChange)="updateQueryParams()"
    />
  `,
  selector: 'app-all-orders',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    NgIf,
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
  ],
})
export class AllOrdersComponent implements AfterViewInit {
  private confirmDialog = injectConfirmDialog();
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private ordersService = inject(OrdersService);

  lumber = loggerOf('AllOrders');

  @ViewChild(NgbSort) sort!: NgbSort;
  @ViewChild(NgbPaginator) paginator!: NgbPaginator;
  columnsToDisplay = ['select', 'orderNumber', 'state', 'table.tableGroup.name', 'waiter.name', 'createdAt', 'actions'];
  dataSource = new PaginatedDataSource<GetOrderMinResponse>(this.ordersService.getAllPaginatedFn());
  filter = new FormControl<string>('');
  selection = new SelectionModel<GetOrderMinResponse>(true, [], false, (a, b) => a.id === b.id);

  download$?: Observable<Download>;

  tableOptions = toSignal(
    this.activatedRoute.queryParamMap.pipe(
      map((it) => ({
        page: it.get('page') ? n_from(it.get('page')) : 1,
        pageSize: it.get('pageSize') ? n_from(it.get('pageSize')) : 50,
        sort: it.get('sort') ?? 'createdAt',
        direction: (it.get('direction') ?? 'desc') as SortDirection,
      })),
      shareReplay(1),
    ),
    {
      initialValue: {
        page: 1,
        pageSize: 50,
        sort: 'createdAt',
        direction: 'desc' as SortDirection,
      },
    },
  );

  constructor() {
    this.filter.valueChanges.pipe(
      takeUntilDestroyed(),
      debounceTime(700),
      tap((it) => {
        this.dataSource.filter = it ?? '';
      }),
    );
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  updateQueryParams(): void {
    void this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        pageSize: this.paginator.pageSize,
        page: this.paginator.page,
        sort: this.sort.active,
        direction: this.sort.direction,
      },
      queryParamsHandling: 'merge', // remove to replace all query params by provided
    });
  }

  exportCsv(): void {
    this.download$ = this.ordersService.download$();
  }

  printAllTest(): void {
    this.ordersService.printAllTest$().subscribe();
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
