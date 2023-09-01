import {SelectionModel} from '@angular/cdk/collections';
import {AsyncPipe, DatePipe, NgIf} from '@angular/common';
import {AfterViewInit, ChangeDetectionStrategy, Component, inject, ViewChild} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {NgbProgressbar, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {b_fromStorage, loggerOf, s_imploder, st_set} from 'dfts-helper';
import {DfxPaginationModule, DfxSortModule, DfxTableModule, NgbPaginator, NgbSort} from 'dfx-bootstrap-table';
import {DfxTr} from 'dfx-translate';

import {debounceTime, distinctUntilChanged, forkJoin, Observable, tap} from 'rxjs';
import {Download} from 'src/app/_shared/services/download.service';
import {PaginatedDataSource} from '../../_shared/paginated-data-source';
import {AppBtnToolbarComponent} from '../../_shared/ui/app-btn-toolbar.component';

import {AppIconsModule} from '../../_shared/ui/icons.module';
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

    <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
      <btn-toolbar>
        <div>
          <button class="btn btn-sm btn-info" (click)="exportCsv()">
            <i-bs name="filetype-csv" />
            {{ 'HOME_ORDER_EXPORT' | tr }}
          </button>
        </div>

        <div>
          <button class="btn btn-sm btn-warning" (click)="requeueOrders()" [class.disabled]="!selection.hasValue()">
            <i-bs name="printer" />
            {{ 'HOME_ORDER_REQUEUE' | tr }}
          </button>
        </div>
      </btn-toolbar>

      <ng-container *ngIf="openInNewTabChanges$ | async" />
      <div class="form-check form-switch form-check-reverse">
        <label class="form-check-label" for="continuousCreation">In neuen Tab öffnen</label>
        <input [formControl]="openInNewTab" class="form-check-input" type="checkbox" role="switch" id="continuousCreation" />
      </div>
    </div>

    <ng-container *ngIf="download$ | async as download">
      <ngb-progressbar
        type="success"
        *ngIf="download.state !== 'DONE'"
        [showValue]="true"
        [striped]="download.state === 'PENDING'"
        [value]="download.progress"
      />
    </ng-container>

    <form class="mt-2">
      <div class="input-group">
        <input class="form-control ml-2 bg-dark text-white" type="text" [formControl]="filter" placeholder="{{ 'SEARCH' | tr }}" />
        <button
          class="btn btn-outline-secondary"
          type="button"
          ngbTooltip="{{ 'CLEAR' | tr }}"
          placement="bottom"
          (click)="filter.reset()"
          *ngIf="(filter.value?.length ?? 0) > 0"
        >
          <i-bs name="x-circle-fill" />
        </button>
      </div>
    </form>

    <div class="table-responsive">
      <table ngb-table [hover]="true" [dataSource]="dataSource" ngb-sort ngbSortActive="createdAt" ngbSortDirection="desc">
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
              [orderProductStates]="order.orderProductStates"
              [createdAt]="order.createdAt"
              [processedAt]="order.processedAt"
            />
          </td>
        </ng-container>

        <ng-container ngbColumnDef="createdAt">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_ORDER_CREATED_AT' | tr }}</th>
          <td *ngbCellDef="let order" ngb-cell>{{ order.createdAt | date: 'dd.MM. HH:mm:ss' }}</td>
        </ng-container>

        <ng-container ngbColumnDef="actions">
          <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | tr }}</th>
          <td *ngbCellDef="let order" ngb-cell>
            <button
              class="btn btn-sm m-1 btn-outline-primary text-white"
              (click)="$event.stopPropagation(); openOrder(order)"
              ngbTooltip="{{ 'OPEN' | tr }}"
              placement="left"
            >
              <i-bs name="arrow-up-right-square-fill" />
            </button>
            <button
              class="btn btn-sm m-1 btn-warning"
              (click)="$event.stopPropagation(); requeueOrder(order)"
              ngbTooltip="{{ 'HOME_ORDER_REQUEUE' | tr }}"
              placement="right"
            >
              <i-bs name="printer" />
            </button>
          </td>
        </ng-container>

        <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
        <tr *ngbRowDef="let order; columns: columnsToDisplay" ngb-row (click)="openOrder(order)" class="clickable"></tr>
      </table>
    </div>

    <div class="w-100 text-center" *ngIf="(dataSource.data?.numberOfItems ?? 1) < 1">
      {{ 'HOME_STATISTICS_NO_DATA' | tr }}
    </div>

    <app-spinner-row *ngIf="!dataSource.data" />

    <ngb-paginator [collectionSize]="dataSource.data?.numberOfItems ?? 0" [pageSizes]="[10, 20, 50, 100, 200]" [pageSize]="50" />
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
    AppIconsModule,
    AppOrderStateBadgeComponent,
    AppOrderRefreshButtonComponent,
    AppBtnToolbarComponent,
    AppSpinnerRowComponent,
  ],
})
export class AllOrdersComponent implements AfterViewInit {
  private confirmDialog = injectConfirmDialog();
  private router = inject(Router);
  private ordersService = inject(OrdersService);

  lumber = loggerOf('AllOrders');

  openInNewTab = new FormControl<boolean>(b_fromStorage('open_order_in_new_tab') ?? true);
  openInNewTabChanges$ = this.openInNewTab.valueChanges.pipe(
    distinctUntilChanged(),
    tap((it) => st_set('open_order_in_new_tab', it ?? true)),
  );

  @ViewChild(NgbSort) sort?: NgbSort;
  @ViewChild(NgbPaginator, {static: true}) paginator!: NgbPaginator;
  columnsToDisplay = ['select', 'orderNumber', 'state', 'table.tableGroup.name', 'waiter.name', 'createdAt', 'actions'];
  dataSource = new PaginatedDataSource<GetOrderMinResponse>(this.ordersService.getAllPaginated$);
  filter = new FormControl<string>('');
  selection = new SelectionModel<GetOrderMinResponse>(true, [], false, (a, b) => a.id === b.id);

  download$?: Observable<Download>;

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

  openOrder(it: GetOrderMinResponse): void {
    if (this.openInNewTab.value ?? true) {
      const url = this.router.serializeUrl(this.router.createUrlTree([`/home/orders/${it.id}`]));

      window.open(url, '_blank');
      return;
    }
    void this.router.navigateByUrl(`/home/orders/${it.id}`);
  }

  exportCsv(): void {
    this.download$ = this.ordersService.download$();
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
