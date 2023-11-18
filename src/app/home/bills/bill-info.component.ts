import {AsyncPipe, DatePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';

import {combineLatest, map, switchMap} from 'rxjs';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTr} from 'dfx-translate';

import {getActivatedRouteIdParam} from '../../_shared/services/getActivatedRouteIdParam';
import {AppBackButtonComponent} from '../../_shared/ui/button/app-back-button.component';
import {ScrollableToolbarComponent} from '../../_shared/ui/button/scrollable-toolbar.component';
import {AppBillPaymentStateBadgeComponent} from './_components/app-bill-payment-state-badge.component';
import {AppOrderProductsListTableComponent} from './_components/app-bill-products-list-table.component';
import {AppBillRefreshButtonComponent} from './_components/app-bill-refresh-button.component';
import {BillsService} from './_services/bills.service';

@Component({
  template: `
    @if (vm$ | async; as vm) {
      <div class="d-flex flex-wrap justify-content-between gap-2 gap-md-0 mb-2">
        <h1 class="mb-0">{{ 'HOME_BILL' | tr }} #{{ vm.bill.id }}</h1>
      </div>

      <scrollable-toolbar>
        <app-bill-payment-state-badge [unpaidReason]="vm.bill.unpaidReason?.reason" />

        <span class="badge bg-secondary d-flex align-items-center gap-2" [ngbTooltip]="'HOME_ORDER_CREATED_AT' | tr">
          <bi name="save" />
          {{ vm.bill.createdAt | date: 'dd.MM.yy HH:mm:ss' }}
        </span>

        <a
          routerLink="../../tables/{{ vm.bill.table.id }}"
          class="badge bg-secondary d-flex align-items-center gap-2"
          ngbTooltip="{{ 'HOME_ORDER_OPEN_TABLE' | tr }}"
        >
          <bi name="columns-gap" />
          {{ vm.bill.table.group.name }} - {{ vm.bill.table.number }}
        </a>

        <a
          routerLink="../../waiters/{{ vm.bill.waiter.id }}"
          class="badge bg-primary d-flex align-items-center gap-2"
          ngbTooltip="{{ 'HOME_ORDER_OPEN_WAITER' | tr }}"
        >
          <bi name="people" />
          {{ vm.bill.waiter.name }}
        </a>
      </scrollable-toolbar>

      <scrollable-toolbar disablePadding>
        <back-button />
      </scrollable-toolbar>

      <hr />

      <app-bill-products-list-table [billProducts]="vm.bill.implodedBillProducts" [priceSum]="vm.bill.pricePaidSum" />
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
    DfxTr,
    NgbTooltip,
    AppBillPaymentStateBadgeComponent,
    AppOrderProductsListTableComponent,
  ],
})
export class BillInfoComponent {
  billsService = inject(BillsService);

  vm$ = combineLatest([getActivatedRouteIdParam().pipe(switchMap((id) => this.billsService.getSingle$(id)))]).pipe(
    map(([bill]) => {
      return {
        bill,
      };
    }),
  );
}
