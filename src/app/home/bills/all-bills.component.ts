import {AsyncPipe, DatePipe} from '@angular/common';
import {AfterViewInit, ChangeDetectionStrategy, Component, inject, ViewChild} from '@angular/core';
import {RouterLink} from '@angular/router';

import {debounceTime, map, merge, pipe, switchMap, tap} from 'rxjs';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {computedFrom} from 'ngxtension/computed-from';
import {DfxCurrencyCentPipe} from 'src/app/home/_shared/pipes/currency.pipe';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxPaginationModule, DfxSortModule, DfxTableModule, NgbPaginator, NgbSort} from 'dfx-bootstrap-table';
import {DfxTr} from 'dfx-translate';

import {AppProgressBarComponent} from '../../_shared/ui/loading/app-progress-bar.component';
import {getSortParam, injectPagination} from '../_shared/services/pagination';
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
  ],
})
export class AllBillsComponent implements AfterViewInit {
  private billsService = inject(BillsService);

  pagination = injectPagination('createdAt', 'desc');

  @ViewChild(NgbSort, {static: true}) sort!: NgbSort;
  @ViewChild(NgbPaginator, {static: true}) paginator!: NgbPaginator;
  columnsToDisplay = ['createdAt', 'price', 'unpaidReason.name', 'waiter.name', 'table.tableGroup.name', 'actions'];

  dataSource = computedFrom(
    [this.pagination.params],
    pipe(
      debounceTime(350),
      tap(() => this.pagination.loading.set(true)),
      switchMap(([options]) =>
        this.billsService.getAllPaginated({
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
}
