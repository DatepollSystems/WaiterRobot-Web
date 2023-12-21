import {SelectionModel} from '@angular/cdk/collections';
import {AsyncPipe, DatePipe} from '@angular/common';
import {AfterViewInit, ChangeDetectionStrategy, Component, inject, ViewChild} from '@angular/core';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';
import {ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';

import {debounceTime, forkJoin, map, merge, Observable, pipe, startWith, switchMap, tap} from 'rxjs';

import {NgbProgressbar, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import {computedFrom} from 'ngxtension/computed-from';
import {Download} from 'src/app/home/_shared/services/download.service';

import {loggerOf, n_from, s_imploder} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxPaginationModule, DfxSortModule, DfxTableModule, NgbPaginator, NgbSort} from 'dfx-bootstrap-table';
import {injectIsMobile} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';

import {injectCustomFormBuilder, injectIsValid} from '../../_shared/form';
import {AppProgressBarComponent} from '../../_shared/ui/loading/app-progress-bar.component';
import {AppSpinnerRowComponent} from '../../_shared/ui/loading/app-spinner-row.component';
import {GetOrderMinResponse, GetTableWithGroupResponse} from '../../_shared/waiterrobot-backend';
import {AppTestBadge} from '../_shared/components/app-test-badge.component';
import {injectConfirmDialog} from '../_shared/components/question-dialog.component';
import {ScrollableToolbarComponent} from '../_shared/components/scrollable-toolbar.component';
import {getSortParam, injectPagination} from '../_shared/services/pagination';
import {ProductsService} from '../products/_services/products.service';
import {TableGroupsService} from '../tables/_services/table-groups.service';
import {TablesService} from '../tables/_services/tables.service';
import {OrganisationWaitersService} from '../waiters/_services/organisation-waiters.service';
import {AppOrderRefreshButtonComponent} from './_components/app-order-refresh-button.component';
import {AppOrderStateBadgeComponent} from './_components/app-order-state-badge.component';
import {OrdersService} from './orders.service';

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      <div class="d-flex align-items-center justify-content-between">
        <h1 class="my-0">{{ 'NAV_ORDERS' | tr }}</h1>
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

      @if (isFilterValid()) {}

      <form [formGroup]="filterForm" class="d-flex flex-column flex-md-wrap flex-sm-row gap-2">
        <div class="form-group col-12 col-sm-5 col-md-3 col-xl-2">
          <ng-select
            [items]="tableGroups()"
            bindValue="id"
            bindLabel="name"
            formControlName="tableGroupId"
            [placeholder]="'HOME_TABLE_GROUP_SELECT' | tr"
          />
        </div>
        <div class="form-group col-12 col-sm-5 col-md-3 col-xl-2">
          <ng-select
            [items]="tables()"
            bindValue="id"
            formControlName="tableId"
            [searchFn]="customTableSearch"
            [placeholder]="'HOME_TABLE_SELECT' | tr"
          >
            <ng-template ng-label-tmp let-item="item" let-clear="clear">
              <span class="ng-value-icon left" (click)="clear(item)" aria-hidden="true">×</span>
              <span class="ng-value-label">{{ item?.group?.name ?? '' }} {{ item?.number ?? '' }}</span>
            </ng-template>
            <ng-template ng-option-tmp let-item="item" let-index="index" let-search="searchTerm">
              <span class="ng-option-label">{{ item.group.name }} - {{ item.number }}</span>
            </ng-template>
          </ng-select>
        </div>

        <div class="form-group col-12 col-sm-5 col-md-3 col-xl-2">
          <ng-select
            [items]="waiters()"
            bindValue="id"
            bindLabel="name"
            formControlName="waiterId"
            [placeholder]="'HOME_WAITERS_SELECT' | tr"
          />
        </div>

        <div class="form-group col-12 col-sm-5 col-md-3 col-xl-2">
          <ng-select
            [items]="products()"
            bindLabel="name"
            bindValue="id"
            [multiple]="true"
            placeholder="{{ 'Select Product' | tr }}"
            clearAllText="Clear"
            formControlName="productIds"
          >
          </ng-select>
        </div>
      </form>

      <hr />

      <div class="table-responsive">
        <table
          ngb-table
          [hover]="true"
          [dataSource]="dataSource()"
          ngb-sort
          [ngbSortDirection]="pagination.params().direction"
          [ngbSortActive]="pagination.params().sort"
        >
          <ng-container ngbColumnDef="select">
            <th *ngbHeaderCellDef ngb-header-cell></th>
            <td *ngbCellDef="let selectable" ngb-cell (click)="$event.stopPropagation()">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  name="checked"
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
      </div>

      <app-progress-bar [hidden]="!pagination.loading()" />

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
    </div>
  `,
  selector: 'app-all-orders',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    RouterLink,
    DatePipe,
    ReactiveFormsModule,
    NgbTooltip,
    NgbProgressbar,
    DfxTableModule,
    DfxSortModule,
    DfxPaginationModule,
    DfxTr,
    BiComponent,
    NgSelectModule,
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
  private ordersService = inject(OrdersService);

  pagination = injectPagination('createdAt', 'desc');

  route = inject(ActivatedRoute);
  router = inject(Router);

  isMobile = injectIsMobile();

  lumber = loggerOf('AllOrders');

  @ViewChild(NgbSort) sort!: NgbSort;
  @ViewChild(NgbPaginator) paginator!: NgbPaginator;

  columnsToDisplay = ['select', 'orderNumber', 'state', 'table.tableGroup.name', 'waiter.name', 'createdAt', 'actions'];
  selection = new SelectionModel<GetOrderMinResponse>(true, [], false, (a, b) => a.id === b.id);

  download$?: Observable<Download>;

  filterForm = injectCustomFormBuilder().group({
    tableId: [undefined as unknown as number],
    tableGroupId: [undefined as unknown as number],
    waiterId: [undefined as unknown as number],
    productIds: [new Array<number>()],
  });

  isFilterValid = injectIsValid(this.filterForm);

  dataSource = computedFrom(
    [
      this.pagination.params,
      this.filterForm.valueChanges.pipe(
        startWith({tableId: undefined, waiterId: undefined, tableGroupId: undefined, productIds: undefined}),
      ),
    ],
    pipe(
      debounceTime(350),
      tap(() => this.pagination.loading.set(true)),
      switchMap(([options, {tableId, waiterId, tableGroupId, productIds}]) =>
        this.ordersService.getAllPaginated(
          {
            page: options.page,
            size: options.size,
            sort: getSortParam(options.sort, options.direction),
          },
          tableGroupId,
          tableId,
          waiterId,
          productIds,
        ),
      ),
      map((it) => {
        this.pagination.loading.set(false);
        this.pagination.totalElements.set(it.numberOfItems);
        return it.data;
      }),
    ),
    {initialValue: []},
  );

  tables = toSignal(inject(TablesService).getAll$(), {initialValue: []});
  tableGroups = toSignal(inject(TableGroupsService).getAll$(), {initialValue: []});
  waiters = toSignal(inject(OrganisationWaitersService).getAll$(), {initialValue: []});
  products = toSignal(inject(ProductsService).getAll$(), {initialValue: []});

  constructor() {
    this.route.queryParamMap
      .pipe(
        takeUntilDestroyed(),
        map((params) => ({
          tableId: params.get('tableId'),
          waiterId: params.get('waiterId'),
          tableGroupId: params.get('tableGroupId'),
        })),
      )
      .subscribe(({waiterId, tableId, tableGroupId}) => {
        if (tableId && n_from(tableId) !== this.filterForm.controls.tableId.value) {
          this.filterForm.controls.tableId.patchValue(n_from(tableId));
        }
        if (waiterId && n_from(waiterId) !== this.filterForm.controls.waiterId.value) {
          this.filterForm.controls.waiterId.patchValue(n_from(waiterId));
        }
        if (tableGroupId && n_from(tableGroupId) !== this.filterForm.controls.tableGroupId.value) {
          this.filterForm.controls.tableGroupId.patchValue(n_from(tableGroupId));
        }
      });

    this.filterForm.valueChanges.pipe(takeUntilDestroyed()).subscribe((queryParams) => {
      this.lumber.info('filterFormValueChanges', 'Set query params', queryParams);
      void this.router.navigate([], {
        relativeTo: this.route,
        queryParamsHandling: 'merge',
        queryParams,
      });
    });
  }

  ngAfterViewInit(): void {
    merge(this.paginator.page, this.sort.sortChange).subscribe(() => {
      const params = {
        size: this.paginator.pageSize,
        page: this.paginator.pageIndex,
        sort: this.sort.active,
        direction: this.sort.direction,
      };
      this.lumber.log('updatePaginationParams', 'new params', params);
      this.pagination.updateParams(params);
    });
  }

  customTableSearch(term: string, item: GetTableWithGroupResponse): boolean {
    term = term.toLowerCase().trim();
    return (
      item.group.name.toLowerCase().trim().indexOf(term) > -1 ||
      item.number.toString().toLowerCase().trim().indexOf(term) > -1 ||
      `${item.group.name} - ${item.number}`.toLowerCase().trim().indexOf(term) > -1
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
