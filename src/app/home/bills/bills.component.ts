import {AsyncPipe, DatePipe} from '@angular/common';
import {AfterViewInit, ChangeDetectionStrategy, Component, computed, inject, ViewChild} from '@angular/core';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

import {ScrollableToolbarComponent} from '@home-shared/components/scrollable-toolbar.component';
import {Download} from '@home-shared/services/download.service';
import {injectFilter} from '@home-shared/services/filter';
import {getSortParam, injectPagination} from '@home-shared/services/pagination';
import {NgbCollapse, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import {injectCustomFormBuilder} from '@shared/form';
import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';
import {GetTableWithGroupResponse} from '@shared/waiterrobot-backend';

import {loggerOf} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxPaginationModule, DfxSortModule, DfxTableModule, NgbPaginator, NgbSort} from 'dfx-bootstrap-table';
import {injectIsMobile} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';
import {computedFrom} from 'ngxtension/computed-from';

import {debounceTime, map, merge, Observable, pipe, switchMap, tap} from 'rxjs';
import {DfxCurrencyCentPipe} from 'src/app/home/_shared/pipes/currency.pipe';

import {ProductGroupsService} from '../products/_services/product-groups.service';
import {ProductsService} from '../products/_services/products.service';
import {TableGroupsService} from '../tables/_services/table-groups.service';
import {TablesService} from '../tables/_services/tables.service';
import {OrganisationWaitersService} from '../waiters/_services/organisation-waiters.service';
import {AppBillPaymentStateBadgeComponent} from './_components/app-bill-payment-state-badge.component';
import {AppBillRefreshButtonComponent} from './_components/app-bill-refresh-button.component';
import {BillsService} from './_services/bills.service';
import {UnpaidReasonsService} from './_services/unpaid-reasons.service';

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      <div class="d-flex align-items-center justify-content-between">
        <h1 class="my-0">{{ 'NAV_BILLS' | tr }}</h1>
        <div class="d-inline-flex gap-2 me-2">
          <app-bill-refresh-btn [loading]="pagination.loading()" />
          @if (isMobile()) {
            <button type="button" class="btn btn-outline-info position-relative" (click)="collapse.toggle()">
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
          <button type="button" class="btn btn-sm btn-info" (click)="exportCsv()">
            <bi name="filetype-csv" />
            {{ 'EXPORT' | tr }}
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
          <div class="form-group col-12 col-sm-5 col-md-3 col-lg-3 col-xl-2">
            <ng-select
              bindValue="id"
              bindLabel="reason"
              formControlName="unpaidReasonId"
              [items]="unpaidReasonsFilter()"
              [placeholder]="'Zahlungsstatus' | tr"
            />
          </div>

          <div class="form-group col-12 col-sm-5 col-md-3 col-lg-3 col-xl-2">
            <ng-select
              bindValue="id"
              bindLabel="name"
              formControlName="tableGroupIds"
              clearAllText="Clear"
              [items]="tableGroups()"
              [placeholder]="'HOME_TABLE_GROUP_SELECT' | tr"
              [multiple]="true"
            />
          </div>
          <div class="form-group col-12 col-sm-5 col-md-3 col-lg-3 col-xl-2">
            <ng-select
              bindValue="id"
              formControlName="tableIds"
              clearAllText="Clear"
              [items]="tables()"
              [searchFn]="customTableSearch"
              [placeholder]="'HOME_TABLE_SELECT' | tr"
              [multiple]="true"
            >
              <ng-template let-item="item" let-clear="clear" ng-label-tmp>
                <span class="ng-value-icon left" aria-hidden="true" (click)="clear(item)">×</span>
                <span class="ng-value-label">{{ item?.group?.name ?? '' }} - {{ item?.number ?? '' }}</span>
              </ng-template>
              <ng-template let-item="item" let-index="index" let-search="searchTerm" ng-option-tmp>
                <span class="ng-option-label">{{ item.group.name }} - {{ item.number }}</span>
              </ng-template>
            </ng-select>
          </div>

          <div class="form-group col-12 col-sm-5 col-md-3 col-lg-3 col-xl-2">
            <ng-select
              bindValue="id"
              bindLabel="name"
              formControlName="productGroupIds"
              clearAllText="Clear"
              [items]="productGroups()"
              [placeholder]="'HOME_PROD_GROUPS_SELECT' | tr"
              [multiple]="true"
            />
          </div>

          <div class="form-group col-12 col-sm-5 col-md-3 col-lg-3 col-xl-2">
            <ng-select
              bindValue="id"
              bindLabel="name"
              formControlName="productIds"
              clearAllText="Clear"
              [items]="products()"
              [placeholder]="'HOME_PROD_SELECT' | tr"
              [multiple]="true"
            />
          </div>

          <div class="form-group col-12 col-sm-5 col-md-3 col-lg-3 col-xl-2">
            <ng-select
              bindValue="id"
              bindLabel="name"
              formControlName="waiterIds"
              clearAllText="Clear"
              [items]="waiters()"
              [placeholder]="'HOME_WAITERS_SELECT' | tr"
              [multiple]="true"
            />
          </div>

          <button
            type="button"
            class="btn btn-sm btn-secondary position-relative"
            [disabled]="filter.count() === 0"
            (click)="filter.form.reset()"
          >
            <bi name="x-circle-fill" />
            {{ 'DELETE_ALL' | tr }}
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
          ngb-table
          ngb-sort
          [hover]="true"
          [dataSource]="dataSource()"
          [ngbSortActive]="pagination.params().sort"
          [ngbSortDirection]="pagination.params().direction"
        >
          <ng-container ngbColumnDef="createdAt">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_ORDER_CREATED_AT' | tr }}</th>
            <td *ngbCellDef="let bill" ngb-cell>{{ bill.createdAt | date: 'dd.MM.yy HH:mm:ss' }}</td>
          </ng-container>

          <ng-container ngbColumnDef="unpaidReason.name">
            <th *ngbHeaderCellDef ngb-header-cell>{{ 'STATE' | tr }}</th>
            <td *ngbCellDef="let bill" ngb-cell>
              <app-bill-payment-state-badge [unpaidReason]="bill.unpaidReason?.reason" />
            </td>
          </ng-container>

          <ng-container ngbColumnDef="price">
            <th *ngbHeaderCellDef ngb-header-cell>{{ 'PRICE' | tr }}</th>
            <td *ngbCellDef="let bill" ngb-cell>
              {{ bill.pricePaidSum | currency }}
            </td>
          </ng-container>

          <ng-container ngbColumnDef="waiter.name">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_WAITERS_NAV_ORGANISATION' | tr }}</th>
            <td *ngbCellDef="let bill" ngb-cell>
              <a [routerLink]="'../../waiters/' + bill.waiter.id" (click)="$event.stopPropagation()">{{ bill.waiter.name }}</a>
            </td>
          </ng-container>

          <ng-container ngbColumnDef="table.tableGroup.name">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header class="ws-nowrap">{{ 'HOME_ORDER_TABLE' | tr }}</th>
            <td *ngbCellDef="let bill" ngb-cell>
              <a [routerLink]="'../../tables/groups/tables/' + bill.table.group.id" (click)="$event.stopPropagation()">{{
                bill.table.group.name
              }}</a>
              - <a [routerLink]="'../../tables/' + bill.table.id" (click)="$event.stopPropagation()">{{ bill.table.number }}</a>
            </td>
          </ng-container>

          <ng-container ngbColumnDef="actions">
            <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | tr }}</th>
            <td *ngbCellDef="let bill" ngb-cell>
              <a
                class="btn btn-sm m-1 btn-outline-primary text-body-emphasis"
                placement="left"
                [routerLink]="'../' + bill.id"
                [ngbTooltip]="'OPEN' | tr"
              >
                <bi name="arrow-up-right-square-fill" />
              </a>
            </td>
          </ng-container>

          <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
          <tr *ngbRowDef="let bill; columns: columnsToDisplay" ngb-row class="clickable" [routerLink]="'../' + bill.id"></tr>
        </table>
      </div>

      <app-progress-bar [show]="pagination.loading()" />

      @if (!pagination.loading() && dataSource().length < 1) {
        <div class="w-100 text-center mt-2">
          {{ 'HOME_STATISTICS_NO_DATA' | tr }}
        </div>
      }

      <ngb-paginator
        showFirstLastButtons
        [pageSize]="pagination.params().size"
        [pageIndex]="pagination.params().page"
        [length]="pagination.totalElements()"
        [pageSizeOptions]="[10, 20, 50, 100, 200]"
      />
    </div>
  `,
  selector: 'app-all-bills',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    DatePipe,
    AsyncPipe,
    NgbTooltip,
    DfxTableModule,
    DfxSortModule,
    DfxPaginationModule,
    DfxTr,
    BiComponent,
    DfxCurrencyCentPipe,
    AppBillPaymentStateBadgeComponent,
    AppBillRefreshButtonComponent,
    AppProgressBarComponent,
    NgSelectModule,
    ReactiveFormsModule,
    NgbCollapse,
    ScrollableToolbarComponent,
  ],
})
export class BillsComponent implements AfterViewInit {
  lumber = loggerOf('AllBills');

  private billsService = inject(BillsService);

  isMobile = injectIsMobile();

  pagination = injectPagination('createdAt', 'desc');

  download$?: Observable<Download>;

  @ViewChild(NgbSort, {static: true}) sort!: NgbSort;
  @ViewChild(NgbPaginator, {static: true}) paginator!: NgbPaginator;
  columnsToDisplay = ['createdAt', 'price', 'unpaidReason.name', 'waiter.name', 'table.tableGroup.name', 'actions'];

  filter = injectFilter(
    injectCustomFormBuilder().group({
      tableIds: [new Array<number>()],
      tableGroupIds: [new Array<number>()],
      productIds: [new Array<number>()],
      productGroupIds: [new Array<number>()],
      waiterIds: [new Array<number>()],
      unpaidReasonId: [undefined as unknown as number],
    }),
  );

  dataSource = computedFrom(
    [this.pagination.params, this.filter.valueChanges],
    pipe(
      debounceTime(350),
      tap(() => {
        this.pagination.loading.set(true);
      }),
      switchMap(([options, filter]) =>
        this.billsService.getAllPaginated(
          {
            page: options.page,
            size: options.size,
            sort: getSortParam(options.sort, options.direction),
          },
          filter?.tableIds,
          filter?.tableGroupIds,
          filter?.productIds,
          filter?.productGroupIds,
          filter?.waiterIds,
          filter?.unpaidReasonId,
        ),
      ),
      tap(() => {
        this.pagination.loading.set(false);
      }),
      tap((it) => {
        this.pagination.totalElements.set(it.numberOfItems);
      }),
      map((it) => it.data),
    ),
    {initialValue: []},
  );

  tables = toSignal(inject(TablesService).getAllWithoutExtra$(), {initialValue: []});
  tableGroups = toSignal(inject(TableGroupsService).getAll$(), {initialValue: []});
  products = toSignal(inject(ProductsService).getAll$(), {initialValue: []});
  productGroups = toSignal(inject(ProductGroupsService).getAll$(), {initialValue: []});
  waiters = toSignal(inject(OrganisationWaitersService).getAll$(), {initialValue: []});
  unpaidReasons = toSignal(inject(UnpaidReasonsService).getAll$(), {initialValue: []});
  unpaidReasonsFilter = computed(() => [{id: -1, reason: 'Bezahlt'}, ...this.unpaidReasons()]);

  constructor() {
    this.billsService.triggerRefresh.pipe(takeUntilDestroyed()).subscribe(() => {
      this.pagination.loading.set(true);
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
      item.group.name.toLowerCase().trim().includes(term) ||
      item.number.toString().toLowerCase().trim().includes(term) ||
      `${item.group.name} - ${item.number}`.toLowerCase().trim().includes(term)
    );
  }

  exportCsv(): void {
    this.download$ = this.billsService.download$();
  }
}
