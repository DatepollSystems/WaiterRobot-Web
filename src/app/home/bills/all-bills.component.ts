import {AsyncPipe, DatePipe, NgIf} from '@angular/common';
import {AfterViewInit, ChangeDetectionStrategy, Component, inject, ViewChild} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';

import {debounceTime, distinctUntilChanged, tap} from 'rxjs';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {b_fromStorage, loggerOf, st_set} from 'dfts-helper';
import {DfxPaginationModule, DfxSortModule, DfxTableModule, NgbPaginator, NgbSort} from 'dfx-bootstrap-table';
import {DfxTr} from 'dfx-translate';

import {PaginatedDataSource} from '../../_shared/paginated-data-source';
import {AppIconsModule} from '../../_shared/ui/icons.module';
import {AppSpinnerRowComponent} from '../../_shared/ui/loading/app-spinner-row.component';
import {GetBillMinResponse, GetOrderMinResponse} from '../../_shared/waiterrobot-backend';
import {BillsService} from './bills.service';
import {DfxCurrencyCentPipe} from '../../_shared/ui/currency.pipe';

@Component({
  template: `
    <div class="d-flex align-items-center justify-content-between">
      <h1>{{ 'HOME_BILLS_ALL' | tr }}</h1>
    </div>

    <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
      <ng-container *ngIf="openInNewTabChanges$ | async" />
      <div class="form-check form-switch form-check-reverse">
        <label class="form-check-label" for="continuousCreation">In neuen Tab öffnen</label>
        <input [formControl]="openInNewTab" class="form-check-input" type="checkbox" role="switch" id="continuousCreation" />
      </div>
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
          <td *ngbCellDef="let order" ngb-cell>{{ order.createdAt | date: 'dd.MM.yy HH:mm:ss' }}</td>
        </ng-container>

        <ng-container ngbColumnDef="price">
          <th *ngbHeaderCellDef ngb-header-cell>{{ 'PRICE' | tr }}</th>
          <td *ngbCellDef="let order" ngb-cell>
            {{ order.priceSum | currency: 'EUR' }}
          </td>
        </ng-container>

        <ng-container ngbColumnDef="waiter.name">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_WAITERS_NAV_ORGANISATION' | tr }}</th>
          <td *ngbCellDef="let order" ngb-cell>
            <a (click)="$event.stopPropagation()" routerLink="/home/waiters/{{ order.waiter.id }}">{{ order.waiter.name }}</a>
          </td>
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

        <ng-container ngbColumnDef="actions">
          <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | tr }}</th>
          <td *ngbCellDef="let order" ngb-cell>
            <button
              class="btn btn-sm m-1 btn-outline-primary text-white"
              (click)="$event.stopPropagation(); openBill(order)"
              ngbTooltip="{{ 'OPEN' | tr }}"
              placement="left"
            >
              <i-bs name="arrow-up-right-square-fill" />
            </button>
          </td>
        </ng-container>

        <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
        <tr *ngbRowDef="let order; columns: columnsToDisplay" ngb-row (click)="openBill(order)" class="clickable"></tr>
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
  ],
})
export class AllBillsComponent implements AfterViewInit {
  private router = inject(Router);
  private billsService = inject(BillsService);

  lumber = loggerOf('AllOrders');

  openInNewTab = new FormControl<boolean>(b_fromStorage('open_bills_in_new_tab') ?? true);
  openInNewTabChanges$ = this.openInNewTab.valueChanges.pipe(
    distinctUntilChanged(),
    tap((it) => st_set('open_bills_in_new_tab', it ?? true)),
  );

  @ViewChild(NgbSort) sort?: NgbSort;
  @ViewChild(NgbPaginator, {static: true}) paginator!: NgbPaginator;
  columnsToDisplay = ['createdAt', 'price', 'waiter.name', 'table.tableGroup.name', 'actions'];
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

  openBill(it: GetOrderMinResponse): void {
    if (this.openInNewTab.value ?? true) {
      const url = this.router.serializeUrl(this.router.createUrlTree([`/home/bills/${it.id}`]));

      window.open(url, '_blank');
      return;
    }
    void this.router.navigateByUrl(`/home/bills/${it.id}`);
  }
}
