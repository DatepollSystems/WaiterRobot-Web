import {AsyncPipe, DatePipe} from '@angular/common';
import {AfterViewInit, ChangeDetectionStrategy, Component, inject, signal, ViewChild} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';

import {debounceTime, map, merge, pipe, switchMap, tap} from 'rxjs';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {DfxCurrencyCentPipe} from 'src/app/_shared/ui/currency.pipe';
import {computedFrom} from 'ngxtension/computed-from';

import {loggerOf} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule, NgbSort} from 'dfx-bootstrap-table';
import {DfxTr} from 'dfx-translate';

import {AppBillPaymentStateBadgeComponent} from './_components/app-bill-payment-state-badge.component';
import {AppBillRefreshButtonComponent} from './_components/app-bill-refresh-button.component';
import {BillsService} from './_services/bills.service';
import {getSort, injectPaginationAndSortParams} from '../../_shared/services/services.interface';
import {NgbPaginator} from '../../_shared/ui/paginator/paginator.component';
import {NgbPaginatorModule} from '../../_shared/ui/paginator/paginator.module';
import {AppProgressBarComponent} from '../../_shared/ui/loading/app-progress-bar.component';

@Component({
  template: `
    <div class="d-flex align-items-center justify-content-between">
      <h1>{{ 'NAV_BILLS' | tr }}</h1>
      <app-bill-refresh-btn />
    </div>

    <div class="table-responsive">
      <table ngb-table [hover]="true" [dataSource]="dataSource()" ngb-sort ngbSortActive="createdAt" ngbSortDirection="desc">
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

      <app-progress-bar [hidden]="!loading()" />
    </div>

    @if (!loading() && dataSource().length < 1) {
      <div class="w-100 text-center mt-2">
        {{ 'HOME_STATISTICS_NO_DATA' | tr }}
      </div>
    }

    <ngb-paginator
      [pageSize]="paginationAndSortParams().size"
      [pageIndex]="paginationAndSortParams().page"
      [length]="totalElements()"
      [pageSizeOptions]="[10, 20, 50, 100, 200]"
      showFirstLastButtons
    />
  `,
  selector: 'app-all-bills',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    DatePipe,
    AsyncPipe,
    ReactiveFormsModule,
    NgbTooltip,
    DfxTableModule,
    DfxSortModule,
    DfxTr,
    BiComponent,
    DfxCurrencyCentPipe,
    AppBillPaymentStateBadgeComponent,
    AppBillRefreshButtonComponent,
    NgbPaginatorModule,
    AppProgressBarComponent,
  ],
})
export class AllBillsComponent implements AfterViewInit {
  private billsService = inject(BillsService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  paginationAndSortParams = injectPaginationAndSortParams('createdAt', 'desc');

  lumber = loggerOf('AllOrders');

  @ViewChild(NgbSort, {static: true}) sort!: NgbSort;
  @ViewChild(NgbPaginator, {static: true}) paginator!: NgbPaginator;
  columnsToDisplay = ['createdAt', 'price', 'unpaidReason.name', 'waiter.name', 'table.tableGroup.name', 'actions'];

  loading = signal(true);
  totalElements = signal<number>(0);

  dataSource = computedFrom(
    [this.paginationAndSortParams],
    pipe(
      debounceTime(350),
      tap(() => this.loading.set(true)),
      switchMap(([options]) =>
        this.billsService.getAllPaginated({
          page: options.page,
          size: options.size,
          sort: getSort(options.sort, options.direction),
        }),
      ),
      tap(() => this.loading.set(false)),
      tap((it) => this.totalElements.set(it.numberOfItems)),
      map((it) => it.data),
    ),
    {initialValue: []},
  );

  ngAfterViewInit(): void {
    merge(this.paginator.page, this.sort.sortChange).subscribe(() => {
      const queryParams = {
        size: this.paginator.pageSize,
        page: this.paginator.pageIndex,
        sort: this.sort.active,
        direction: this.sort.direction,
      };

      void this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParamsHandling: 'merge',
        queryParams,
      });
    });
  }
}
