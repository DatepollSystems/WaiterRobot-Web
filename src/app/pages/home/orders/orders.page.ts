import {SelectionModel} from '@angular/cdk/collections';
import {AsyncPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, viewChild} from '@angular/core';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

import {Observable, debounceTime, forkJoin, map, pipe, switchMap, tap} from 'rxjs';

import {TranslocoPipe} from '@jsverse/transloco';
import {NgbCollapse, NgbDropdownItem, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import {loggerOf, s_imploder} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxPaginationModule, DfxSortModule, DfxTableModule, NgbPaginator, NgbSort} from 'dfx-bootstrap-table';
import {StopPropagationDirective, injectIsMobile} from 'dfx-helper';
import {derivedFrom} from 'ngxtension/derived-from';

import {APIType} from '../../../api';
import {injectFilter} from '../../../api/filter';
import {injectPagination} from '../../../api/pagination';
import {ActionDropdownComponent} from '../../../components/action-dropdown.component';
import {AppTestBadge} from '../../../components/app-test-badge.component';
import {AppProgressBarComponent} from '../../../components/loading/app-progress-bar.component';
import {AppOrderRefreshButtonComponent} from '../../../components/orders/app-order-refresh-button.component';
import {AppOrderStateBadgeComponent} from '../../../components/orders/app-order-state-badge.component';
import {injectConfirmDialog} from '../../../components/question-dialog.component';
import {ScrollableToolbarComponent} from '../../../components/scrollable-toolbar.component';
import {RelativeTimeWithTooltip} from '../../../pipes/relative-time.pipe';
import {Download} from '../../../services/download.service';
import {OrdersService} from '../../../services/orders.service';
import {ProductGroupsService} from '../../../services/product-groups.service';
import {ProductsService} from '../../../services/products.service';
import {TableGroupsService} from '../../../services/table-groups.service';
import {TablesService} from '../../../services/tables.service';
import {OrganisationWaitersService} from '../../../services/waiters/organisation-waiters.service';
import {injectCustomFormBuilder} from '../../../util/form';

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      <div class="d-flex align-items-center justify-content-between">
        <h1 class="my-0">{{ 'NAV_ORDERS' | transloco }}</h1>

        <div class="d-inline-flex gap-2 me-2">
          <app-order-refresh-btn [loading]="pagination.loading()" />
          @if (isMobile()) {
            <button class="btn btn-outline-info position-relative" (mousedown)="collapse.toggle()" type="button">
              <bi name="filter-circle" />
              @if (filter.count() !== 0) {
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {{ filter.count() }}
                  <span class="visually-hidden">unread messages</span>
                </span>
              }
            </button>
          }
        </div>
      </div>

      <scrollable-toolbar>
        <div>
          <button class="btn btn-sm btn-info" (click)="exportCsv()" type="button">
            <bi name="filetype-csv" />
            {{ 'EXPORT' | transloco }}
          </button>
        </div>

        <div>
          <button class="btn btn-sm btn-warning" [class.disabled]="!selection.hasValue()" (mousedown)="requeueOrders()" type="button">
            <bi name="printer" />
            {{ 'HOME_ORDER_REQUEUE' | transloco }}
          </button>
        </div>
        <div>
          <button class="btn btn-sm btn-warning" (click)="printAllTest()" type="button" ngbTooltip="Beinhaltet alle Produkte">
            <bi name="bug" />
            {{ 'Testbestellung aufgeben' | transloco }}
          </button>
        </div>
      </scrollable-toolbar>

      @if (download$ | async; as download) {
        @if (download.state !== 'DONE') {
          <app-progress-bar />
        }
      }

      <div #collapse="ngbCollapse" [ngbCollapse]="isMobile()">
        @if (filter.valid()) {}

        <form class="d-flex flex-column flex-sm-wrap flex-sm-row gap-2" [formGroup]="filter.form">
          <div class="form-group">
            <ng-select
              [items]="tableGroups()"
              [placeholder]="'HOME_TABLE_GROUP_SELECT' | transloco"
              [multiple]="true"
              bindValue="id"
              bindLabel="name"
              formControlName="tableGroupIds"
              clearAllText="Clear"
            />
          </div>
          <div class="form-group">
            <ng-select
              [items]="tables()"
              [searchFn]="customTableSearch"
              [placeholder]="'HOME_TABLE_SELECT' | transloco"
              [multiple]="true"
              bindValue="id"
              formControlName="tableIds"
              clearAllText="Clear"
            >
              <ng-template let-item="item" let-clear="clear" ng-label-tmp>
                <span class="ng-value-icon left" (mousedown)="clear(item)" aria-hidden="true">×</span>
                <span class="ng-value-label">{{ item?.group?.name ?? '' }} - {{ item?.number ?? '' }}</span>
              </ng-template>
              <ng-template let-item="item" let-index="index" let-search="searchTerm" ng-option-tmp>
                <span class="ng-option-label">{{ item.group.name }} - {{ item.number }}</span>
              </ng-template>
            </ng-select>
          </div>

          <div class="form-group">
            <ng-select
              [items]="productGroups()"
              [placeholder]="'HOME_PROD_GROUPS_SELECT' | transloco"
              [multiple]="true"
              bindValue="id"
              bindLabel="name"
              formControlName="productGroupIds"
              clearAllText="Clear"
            />
          </div>

          <div class="form-group">
            <ng-select
              [items]="products()"
              [placeholder]="'HOME_PROD_SELECT' | transloco"
              [multiple]="true"
              bindValue="id"
              bindLabel="name"
              formControlName="productIds"
              clearAllText="Clear"
            />
          </div>

          <div class="form-group">
            <ng-select
              [items]="waiters()"
              [placeholder]="'HOME_WAITERS_SELECT' | transloco"
              [multiple]="true"
              bindValue="id"
              bindLabel="name"
              formControlName="waiterIds"
              clearAllText="Clear"
            />
          </div>

          <button
            class="btn btn-sm btn-secondary position-relative"
            [disabled]="filter.count() === 0"
            (mousedown)="filter.form.reset()"
            type="button"
          >
            <bi name="x-circle-fill" />
            {{ 'DELETE_ALL' | transloco }}
            @if (filter.count() !== 0) {
              <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {{ filter.count() }}
                <span class="visually-hidden">selected filters</span>
              </span>
            }
          </button>
        </form>
      </div>

      <hr class="my-1" />

      <div class="table-responsive">
        <table
          [hover]="true"
          [dataSource]="dataSource()"
          [ngbSortActive]="pagination.sortParams().name"
          [ngbSortDirection]="pagination.sortParams().direction"
          ngb-table
          ngb-sort
        >
          <ng-container ngbColumnDef="select">
            <th *ngbHeaderCellDef ngb-header-cell></th>
            <td *ngbCellDef="let selectable" ngb-cell stopPropagation>
              <div class="form-check">
                <input
                  class="form-check-input"
                  [checked]="selection.isSelected(selectable)"
                  (change)="$event ? selection.toggle(selectable) : null"
                  type="checkbox"
                  name="checked"
                />
              </div>
            </td>
          </ng-container>

          <ng-container ngbColumnDef="orderNumber">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_ORDER_NUMBER' | transloco }}</th>
            <td *ngbCellDef="let order" ngb-cell>{{ order.orderNumber }}</td>
          </ng-container>

          <ng-container ngbColumnDef="table.tableGroup.name">
            <th class="ws-nowrap" *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_ORDER_TABLE' | transloco }}</th>
            <td *ngbCellDef="let order" ngb-cell>
              <a [routerLink]="'../../tables/' + order.table.group.id" stopPropagation>{{ order.table.group.name }}</a>
              -
              <a [routerLink]="'../../tables/t/' + order.table.id" stopPropagation>{{ order.table.number }}</a>
            </td>
          </ng-container>

          <ng-container ngbColumnDef="waiter.name">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_WAITERS_NAV_ORGANISATION' | transloco }}</th>
            <td *ngbCellDef="let order" ngb-cell>
              <a [routerLink]="'../../waiters/waiter/' + order.waiter.id" stopPropagation>{{ order.waiter.name }}</a>
            </td>
          </ng-container>

          <ng-container ngbColumnDef="state">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'STATE' | transloco }}</th>
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
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_ORDER_CREATED_AT' | transloco }}</th>
            <td *ngbCellDef="let order" ngb-cell>
              <wr-relative-time [value]="order.createdAt" format="dd.MM.yy HH:mm:ss" />
            </td>
          </ng-container>

          <ng-container ngbColumnDef="actions">
            <th *ngbHeaderCellDef ngb-header-cell>
              <span class="visually-hidden">{{ 'ACTIONS' | transloco }}</span>
            </th>
            <td *ngbCellDef="let order" ngb-cell>
              <app-action-dropdown>
                <a class="d-flex gap-2 align-items-center" [routerLink]="'../' + order.id" type="button" ngbDropdownItem>
                  <bi name="arrow-up-right-square-fill" />
                  {{ 'OPEN' | transloco }}
                </a>
                <div class="dropdown-divider"></div>
                <button
                  class="d-flex gap-2 align-items-center text-warning-emphasis"
                  (mousedown)="requeueOrder(order)"
                  type="button"
                  ngbDropdownItem
                >
                  <bi name="printer" />
                  {{ 'HOME_ORDER_REQUEUE' | transloco }}
                </button>
              </app-action-dropdown>
            </td>
          </ng-container>

          <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
          <tr *ngbRowDef="let order; columns: columnsToDisplay" [routerLink]="'../' + order.id" ngb-row></tr>
        </table>
      </div>

      <app-progress-bar [show]="pagination.loading()" />

      @if (!pagination.loading() && dataSource().length < 1) {
        <div class="w-100 text-center mt-2">{{ 'HOME_STATISTICS_NO_DATA' | transloco }}</div>
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
  selector: 'orders-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    RouterLink,
    ReactiveFormsModule,
    NgbTooltip,
    NgbCollapse,
    NgSelectModule,
    DfxTableModule,
    DfxSortModule,
    DfxPaginationModule,
    TranslocoPipe,
    BiComponent,
    AppOrderStateBadgeComponent,
    AppOrderRefreshButtonComponent,
    ScrollableToolbarComponent,
    AppTestBadge,
    AppProgressBarComponent,
    ActionDropdownComponent,
    NgbDropdownItem,
    StopPropagationDirective,
    RelativeTimeWithTooltip,
  ],
})
export class OrdersPage {
  #confirmDialog = injectConfirmDialog();
  #ordersService = inject(OrdersService);

  isMobile = injectIsMobile();

  lumber = loggerOf('AllOrders');

  private paginator = viewChild.required(NgbPaginator);
  private sort = viewChild.required(NgbSort);

  pagination = injectPagination({
    defaultSortBy: 'createdAt',
    paginator: this.paginator,
    sort: this.sort,
  });

  columnsToDisplay = ['select', 'orderNumber', 'state', 'table.tableGroup.name', 'waiter.name', 'createdAt', 'actions'];
  selection = new SelectionModel<APIType['GetOrderMinResponse']>(true, [], false, (a, b) => a.id === b.id);

  filter = injectFilter(
    injectCustomFormBuilder().group({
      tableIds: [new Array<number>()],
      tableGroupIds: [new Array<number>()],
      productIds: [new Array<number>()],
      productGroupIds: [new Array<number>()],
      waiterIds: [new Array<number>()],
    }),
  );

  dataSource = derivedFrom(
    [this.pagination.params, this.filter.valueChanges],
    pipe(
      debounceTime(350),
      tap(() => {
        this.pagination.loading.set(true);
      }),
      switchMap(([options, filter]) =>
        this.#ordersService.getAllPaginated(
          options,
          filter?.tableIds,
          filter?.tableGroupIds,
          filter?.productIds,
          filter?.productGroupIds,
          filter?.waiterIds,
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

  download$?: Observable<Download>;

  tables = toSignal(inject(TablesService).getAllWithoutExtra$(), {
    initialValue: [],
  });
  tableGroups = toSignal(inject(TableGroupsService).getAll$(), {
    initialValue: [],
  });
  products = toSignal(inject(ProductsService).getAll$(), {initialValue: []});
  productGroups = toSignal(inject(ProductGroupsService).getAll$(), {
    initialValue: [],
  });
  waiters = toSignal(inject(OrganisationWaitersService).getAll$(), {
    initialValue: [],
  });

  constructor() {
    this.#ordersService.triggerRefresh.pipe(takeUntilDestroyed()).subscribe(() => {
      this.pagination.loading.set(true);
    });
  }

  customTableSearch(term: string, item: APIType['GetTableWithGroupResponse']): boolean {
    term = term.toLowerCase().trim().replace(/\s/g, '');
    const groupName = item.group.name.toLowerCase().trim().replace(/\s/g, '');
    const tableNumber = item.number.toString();
    return groupName.includes(term) || tableNumber.includes(term) || `${groupName}-${tableNumber}`.includes(term);
  }

  exportCsv(): void {
    this.download$ = this.#ordersService.download$();
  }

  printAllTest(): void {
    void this.#confirmDialog('Testbestellung aufgeben?').then((result) => {
      if (result) {
        this.#ordersService.printAllTest();
      }
    });
  }

  requeueOrder(it: APIType['GetOrderMinResponse']): void {
    this.selection.clear();
    this.selection.toggle(it);
    this.requeueOrders();
  }

  requeueOrders(): void {
    this.lumber.info('requeueOrders', 'Opening requeue question dialog');
    this.lumber.info('requeueOrders', 'Selected entities:', this.selection.selected);
    const selected = this.selection.selected.slice();
    void this.#confirmDialog(
      'HOME_ORDER_REQUEUE',
      `<ol><li>${s_imploder()
        .source(selected, (it) => it.orderNumber)
        .separator('</li><li>')
        .build()}</li></ol>`,
    ).then((result) => {
      if (result) {
        const observables: Observable<unknown>[] = [];
        for (const it of selected) {
          observables.push(this.#ordersService.requeueOrder$(it.id));
        }
        forkJoin(observables).subscribe();
      }
    });
  }
}
