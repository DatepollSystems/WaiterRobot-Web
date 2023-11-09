import {AsyncPipe, DatePipe, NgIf} from '@angular/common';
import {AfterViewInit, ChangeDetectionStrategy, Component, inject, ViewChild} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

import {debounceTime, tap} from 'rxjs';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {DfxCurrencyCentPipe} from 'src/app/_shared/ui/currency.pipe';

import {loggerOf} from 'dfts-helper';
import {DfxPaginationModule, DfxSortModule, DfxTableModule, NgbPaginator, NgbSort} from 'dfx-bootstrap-table';
import {DfxTr} from 'dfx-translate';

import {PaginatedDataSource} from '../../_shared/paginated-data-source';
import {AppIconsModule} from '../../_shared/ui/icons.module';
import {AppSpinnerRowComponent} from '../../_shared/ui/loading/app-spinner-row.component';
import {GetBillMinResponse} from '../../_shared/waiterrobot-backend';
import {AppBillPaymentStateBadgeComponent} from './_components/app-bill-payment-state-badge.component';
import {AppBillRefreshButtonComponent} from './_components/app-bill-refresh-button.component';
import {BillsService} from './bills.service';

@Component({
  template: `
    <div class="d-flex align-items-center justify-content-between">
      <h1>{{ 'NAV_BILLS' | tr }}</h1>
      <app-bill-refresh-btn />
    </div>

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
            <a (click)="$event.stopPropagation()" routerLink="/home/waiters/{{ bill.waiter.id }}">{{ bill.waiter.name }}</a>
          </td>
        </ng-container>

        <ng-container ngbColumnDef="table.tableGroup.name">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_ORDER_TABLE' | tr }}</th>
          <td *ngbCellDef="let bill" ngb-cell>
            <a (click)="$event.stopPropagation()" routerLink="/home/tables/groups/tables/{{ bill.table.group.id }}">{{
              bill.table.group.name
            }}</a>
            - <a (click)="$event.stopPropagation()" routerLink="/home/tables/{{ bill.table.id }}">{{ bill.table.number }}</a>
          </td>
        </ng-container>

        <ng-container ngbColumnDef="actions">
          <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | tr }}</th>
          <td *ngbCellDef="let bill" ngb-cell>
            <a
              class="btn btn-sm m-1 btn-outline-primary text-white"
              routerLink="../{{ bill.id }}"
              ngbTooltip="{{ 'OPEN' | tr }}"
              placement="left"
            >
              <i-bs name="arrow-up-right-square-fill" />
            </a>
          </td>
        </ng-container>

        <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
        <tr *ngbRowDef="let bill; columns: columnsToDisplay" ngb-row routerLink="../{{ bill.id }}" class="clickable"></tr>
      </table>
    </div>

    <div class="w-100 text-center" *ngIf="(dataSource.data?.numberOfItems ?? 1) < 1">
      {{ 'HOME_STATISTICS_NO_DATA' | tr }}
    </div>

    <app-spinner-row *ngIf="!dataSource.data" />

    <ngb-paginator [collectionSize]="dataSource.data?.numberOfItems ?? 0" [pageSizes]="[10, 20, 50, 100, 200]" [pageSize]="50" />
  `,
  selector: 'app-all-bills',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    NgIf,
    DatePipe,
    AsyncPipe,
    ReactiveFormsModule,
    NgbTooltip,
    DfxTableModule,
    DfxSortModule,
    DfxPaginationModule,
    DfxTr,
    AppIconsModule,
    AppSpinnerRowComponent,
    DfxCurrencyCentPipe,
    AppBillPaymentStateBadgeComponent,
    AppBillRefreshButtonComponent,
  ],
})
export class AllBillsComponent implements AfterViewInit {
  private billsService = inject(BillsService);

  lumber = loggerOf('AllOrders');

  @ViewChild(NgbSort) sort?: NgbSort;
  @ViewChild(NgbPaginator, {static: true}) paginator!: NgbPaginator;
  columnsToDisplay = ['createdAt', 'price', 'unpaidReason.name', 'waiter.name', 'table.tableGroup.name', 'actions'];
  dataSource = new PaginatedDataSource<GetBillMinResponse>(this.billsService.getAllPaginatedFn());
  filter = new FormControl<string>('');

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
}
