import {AsyncPipe, DatePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@ngneat/transloco';

import {BiComponent} from 'dfx-bootstrap-icons';

import {combineLatest, map, switchMap} from 'rxjs';

import {AppBackButtonComponent} from '../_shared/components/button/app-back-button.component';
import {ScrollableToolbarComponent} from '../_shared/components/scrollable-toolbar.component';
import {injectIdParam$} from '../_shared/services/injectActivatedRouteIdParam';
import {AppBillPaymentStateBadgeComponent} from './_components/app-bill-payment-state-badge.component';
import {AppOrderProductsListTableComponent} from './_components/app-bill-products-list-table.component';
import {AppBillRefreshButtonComponent} from './_components/app-bill-refresh-button.component';
import {BillsService} from './_services/bills.service';

@Component({
  template: `
    @if (vm$ | async; as vm) {
      <div class="d-flex flex-column gap-3">
        <div class="d-flex flex-wrap justify-content-between gap-2 gap-md-0">
          <h1 class="my-0">{{ 'HOME_BILL' | transloco }} #{{ vm.bill.id }}</h1>
        </div>

        <scrollable-toolbar>
          <back-button />

          <app-bill-payment-state-badge [unpaidReason]="vm.bill.unpaidReason?.reason" />

          <div>
            <span class="badge bg-secondary d-flex align-items-center gap-2" [ngbTooltip]="'HOME_ORDER_CREATED_AT' | transloco">
              <bi name="save" />
              {{ vm.bill.createdAt | date: 'dd.MM.yy HH:mm:ss' }}
            </span>
          </div>

          <div>
            <a
              class="badge bg-secondary d-flex align-items-center gap-2"
              [routerLink]="'../../tables/' + vm.bill.table.id"
              [ngbTooltip]="'HOME_ORDER_OPEN_TABLE' | transloco"
            >
              <bi name="columns-gap" />
              {{ vm.bill.table.group.name }} - {{ vm.bill.table.number }}
            </a>
          </div>

          <div>
            <a
              class="badge bg-primary d-flex align-items-center gap-2"
              [routerLink]="'../../waiters/' + vm.bill.waiter.id"
              [ngbTooltip]="'HOME_ORDER_OPEN_WAITER' | transloco"
            >
              <bi name="people" />
              {{ vm.bill.waiter.name }}
            </a>
          </div>
        </scrollable-toolbar>

        <hr />

        <app-bill-products-list-table [billProducts]="vm.bill.implodedBillProducts" [priceSum]="vm.bill.pricePaidSum" />
      </div>
    }
  `,
  selector: 'app-orders-info',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    DatePipe,
    ScrollableToolbarComponent,
    AppBackButtonComponent,
    AppBillRefreshButtonComponent,
    BiComponent,
    RouterLink,
    TranslocoPipe,
    NgbTooltip,
    AppBillPaymentStateBadgeComponent,
    AppOrderProductsListTableComponent,
  ],
})
export class BillInfoComponent {
  billsService = inject(BillsService);

  vm$ = combineLatest([injectIdParam$().pipe(switchMap((id) => this.billsService.getSingle$(id)))]).pipe(
    map(([bill]) => {
      return {
        bill,
      };
    }),
  );
}
