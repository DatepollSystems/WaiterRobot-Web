import {AsyncPipe, DatePipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';

import {combineLatest, map, switchMap} from 'rxjs';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {DfxTr} from 'dfx-translate';

import {getActivatedRouteIdParam} from '../../_shared/services/getActivatedRouteIdParam';
import {AppBackButtonComponent} from '../../_shared/ui/button/app-back-button.component';
import {AppBtnToolbarComponent} from '../../_shared/ui/button/app-btn-toolbar.component';
import {AppIconsModule} from '../../_shared/ui/icons.module';
import {AppBillPaymentStateBadgeComponent} from './_components/app-bill-payment-state-badge.component';
import {AppOrderProductsListTableComponent} from './_components/app-bill-products-list-table.component';
import {AppBillRefreshButtonComponent} from './_components/app-bill-refresh-button.component';
import {BillsService} from './bills.service';

@Component({
  template: `
    <ng-container *ngIf="vm$ | async as vm">
      <div class="d-flex flex-wrap justify-content-between gap-2 gap-md-0">
        <h1 class="mb-0">{{ 'HOME_ORDER' | tr }} #{{ vm.bill.id }}</h1>
        <app-bill-refresh-btn [countdown]="vm.countdown" />
      </div>

      <div class="d-flex flex-wrap gap-2 mt-2 mb-4">
        <app-bill-payment-state-badge [paymentState]="vm.bill.paymentState" [unpaidReason]="vm.bill.unpaidReason?.reason" />

        <span class="badge bg-secondary d-flex align-items-center gap-2 ms-md-5 not-selectable" ngbTooltip="Erstellt um">
          <i-bs name="save" />
          {{ vm.bill.createdAt | date: 'dd.MM.yy HH:mm:ss' }}
        </span>

        <a
          routerLink="/home/tables/{{ vm.bill.table.id }}"
          class="badge bg-secondary d-flex align-items-center gap-2"
          ngbTooltip="{{ 'HOME_ORDER_OPEN_TABLE' | tr }}"
        >
          <i-bs name="columns-gap" />
          {{ vm.bill.table.group.name }} - {{ vm.bill.table.number }}
        </a>

        <a
          routerLink="/home/waiters/{{ vm.bill.waiter.id }}"
          class="badge bg-primary d-flex align-items-center gap-2"
          ngbTooltip="{{ 'HOME_ORDER_OPEN_WAITER' | tr }}"
        >
          <i-bs name="people" />
          {{ vm.bill.waiter.name }}
        </a>
      </div>

      <btn-toolbar padding="false">
        <back-button />
      </btn-toolbar>

      <hr />

      <app-bill-products-list-table [billProducts]="vm.bill.implodedBillProducts" />
    </ng-container>
  `,
  selector: 'app-orders-info',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    AsyncPipe,
    DatePipe,
    AppBtnToolbarComponent,
    AppBackButtonComponent,
    AppBillRefreshButtonComponent,
    AppIconsModule,
    RouterLink,
    DfxTr,
    NgbTooltip,
    AppBillPaymentStateBadgeComponent,
    AppOrderProductsListTableComponent,
  ],
})
export class BillInfoComponent {
  billsService = inject(BillsService);

  vm$ = combineLatest([
    getActivatedRouteIdParam().pipe(switchMap((id) => this.billsService.getSingle$(id))),
    this.billsService.countdown$(),
  ]).pipe(
    map(([bill, countdown]) => {
      return {
        bill,
        countdown,
      };
    }),
  );
}
