import {AsyncPipe, DatePipe} from '@angular/common';
import {AfterViewInit, ChangeDetectionStrategy, Component, inject, ViewChild} from '@angular/core';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';
import {ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';

import {debounceTime, map, merge, pipe, startWith, switchMap, tap} from 'rxjs';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import {computedFrom} from 'ngxtension/computed-from';
import {DfxCurrencyCentPipe} from 'src/app/home/_shared/pipes/currency.pipe';

import {loggerOf, n_from} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxPaginationModule, DfxSortModule, DfxTableModule, NgbPaginator, NgbSort} from 'dfx-bootstrap-table';
import {DfxTr} from 'dfx-translate';

import {injectCustomFormBuilder, injectIsValid} from '../../_shared/form';
import {AppProgressBarComponent} from '../../_shared/ui/loading/app-progress-bar.component';
import {GetTableWithGroupResponse} from '../../_shared/waiterrobot-backend';
import {getSortParam, injectPagination} from '../_shared/services/pagination';
import {TableGroupsService} from '../tables/_services/table-groups.service';
import {TablesService} from '../tables/_services/tables.service';
import {OrganisationWaitersService} from '../waiters/_services/organisation-waiters.service';
import {AppBillPaymentStateBadgeComponent} from './_components/app-bill-payment-state-badge.component';
import {AppBillRefreshButtonComponent} from './_components/app-bill-refresh-button.component';
import {BillsService} from './_services/bills.service';

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      <div class="d-flex align-items-center justify-content-between">
        <h1 class="my-0">{{ 'NAV_BILLS' | tr }}</h1>
        <app-bill-refresh-btn />
      </div>

      @if (isValid()) {}

      <form [formGroup]="filterForm" class="d-flex flex-column flex-sm-wrap flex-sm-row gap-2">
        <div class="form-group col-12 col-sm-5 col-xl-3">
          <ng-select
            [items]="tableGroups()"
            bindValue="id"
            bindLabel="name"
            formControlName="tableGroupId"
            [placeholder]="'HOME_TABLE_GROUP_SELECT' | tr"
          />
        </div>
        <div class="form-group col-12 col-sm-5 col-xl-3">
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

        <div class="form-group col-12 col-sm-5 col-xl-3">
          <ng-select
            [items]="waiters()"
            bindValue="id"
            bindLabel="name"
            formControlName="waiterId"
            [placeholder]="'HOME_WAITERS_SELECT' | tr"
          />
        </div>
      </form>

      <hr />

      <div class="table-responsive">
        <table
          ngb-table
          [hover]="true"
          [dataSource]="dataSource()"
          ngb-sort
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
              <a (click)="$event.stopPropagation()" routerLink="../../waiters/{{ bill.waiter.id }}">{{ bill.waiter.name }}</a>
            </td>
          </ng-container>

          <ng-container ngbColumnDef="table.tableGroup.name">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_ORDER_TABLE' | tr }}</th>
            <td *ngbCellDef="let bill" ngb-cell>
              <a (click)="$event.stopPropagation()" routerLink="../../tables/groups/tables/{{ bill.table.group.id }}">{{
                bill.table.group.name
              }}</a>
              - <a (click)="$event.stopPropagation()" routerLink="../../tables/{{ bill.table.id }}">{{ bill.table.number }}</a>
            </td>
          </ng-container>

          <ng-container ngbColumnDef="actions">
            <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | tr }}</th>
            <td *ngbCellDef="let bill" ngb-cell>
              <a
                class="btn btn-sm m-1 btn-outline-primary text-body-emphasis"
                routerLink="../{{ bill.id }}"
                ngbTooltip="{{ 'OPEN' | tr }}"
                placement="left"
              >
                <bi name="arrow-up-right-square-fill" />
              </a>
            </td>
          </ng-container>

          <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
          <tr *ngbRowDef="let bill; columns: columnsToDisplay" ngb-row routerLink="../{{ bill.id }}" class="clickable"></tr>
        </table>
      </div>

      <app-progress-bar [hidden]="!pagination.loading()" />

      @if (!pagination.loading() && dataSource().length < 1) {
        <div class="w-100 text-center mt-2">
          {{ 'HOME_STATISTICS_NO_DATA' | tr }}
        </div>
      }

      <ngb-paginator
        [pageSize]="pagination.params().size"
        [pageIndex]="pagination.params().page"
        [length]="pagination.totalElements()"
        [pageSizeOptions]="[10, 20, 50, 100, 200]"
        showFirstLastButtons
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
  ],
})
export class AllBillsComponent implements AfterViewInit {
  lumber = loggerOf('AllBills');

  private billsService = inject(BillsService);

  private route = inject(ActivatedRoute);
  private router = inject(Router);

  pagination = injectPagination('createdAt', 'desc');

  @ViewChild(NgbSort, {static: true}) sort!: NgbSort;
  @ViewChild(NgbPaginator, {static: true}) paginator!: NgbPaginator;
  columnsToDisplay = ['createdAt', 'price', 'unpaidReason.name', 'waiter.name', 'table.tableGroup.name', 'actions'];

  filterForm = injectCustomFormBuilder().group({
    tableId: [undefined as unknown as number],
    tableGroupId: [undefined as unknown as number],
    waiterId: [undefined as unknown as number],
  });

  isValid = injectIsValid(this.filterForm);

  dataSource = computedFrom(
    [
      this.pagination.params,
      this.filterForm.valueChanges.pipe(startWith({tableId: undefined, waiterId: undefined, tableGroupId: undefined})),
    ],
    pipe(
      debounceTime(350),
      tap(() => this.pagination.loading.set(true)),
      switchMap(([options, {tableId, waiterId, tableGroupId}]) =>
        this.billsService.getAllPaginated(
          {
            page: options.page,
            size: options.size,
            sort: getSortParam(options.sort, options.direction),
          },
          tableGroupId,
          tableId,
          waiterId,
        ),
      ),
      tap(() => this.pagination.loading.set(false)),
      tap((it) => this.pagination.totalElements.set(it.numberOfItems)),
      map((it) => it.data),
    ),
    {initialValue: []},
  );

  tables = toSignal(inject(TablesService).getAll$(), {initialValue: []});
  tableGroups = toSignal(inject(TableGroupsService).getAll$(), {initialValue: []});
  waiters = toSignal(inject(OrganisationWaitersService).getAll$(), {initialValue: []});

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
}
