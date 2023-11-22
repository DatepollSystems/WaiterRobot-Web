import {AsyncPipe, DatePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';

import {combineLatest, map, switchMap} from 'rxjs';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTr} from 'dfx-translate';

import {injectIdParam$} from '../../_shared/services/injectActivatedRouteIdParam';
import {AppTestBadge} from '../../_shared/ui/app-test-badge.component';
import {AppBackButtonComponent} from '../../_shared/ui/button/app-back-button.component';
import {ScrollableToolbarComponent} from '../../_shared/ui/button/scrollable-toolbar.component';
import {injectConfirmDialog} from '../../_shared/ui/question-dialog/question-dialog.component';
import {AppOrderRefreshButtonComponent} from './_components/app-order-refresh-button.component';
import {AppOrderStateBadgeComponent} from './_components/app-order-state-badge.component';
import {AppOrderProductsListComponent} from './_components/order-products-list/app-order-products-list.component';
import {OrdersService} from './orders.service';

@Component({
  template: `
    @if (vm$ | async; as vm) {
      <div class="d-flex flex-column gap-3">
        <div class="d-flex flex-wrap justify-content-between gap-2 gap-md-0">
          <h1 class="my-0">{{ 'HOME_ORDER' | tr }} #{{ vm.order.orderNumber }}</h1>
          <app-order-refresh-btn [countdown]="vm.countdown" />
        </div>

        <scrollable-toolbar>
          <app-order-state-badge
            [orderState]="vm.order.state"
            [orderProductPrintStates]="vm.orderProductPrintStates"
            [createdAt]="vm.order.createdAt"
            [processedAt]="vm.order.processedAt"
          />

          @if (vm.order.test) {
            <app-test-badge />
          }

          @if (vm.order.state !== 'QUEUED') {
            <span class="badge bg-secondary d-flex align-items-center gap-2" [ngbTooltip]="'HOME_ORDER_CREATED_AT' | tr">
              <bi name="save" />
              {{ vm.order.createdAt | date: 'dd.MM.yy HH:mm:ss' }}
            </span>
          }

          <a
            routerLink="../../tables/{{ vm.order.table.id }}"
            class="badge bg-secondary d-flex align-items-center gap-2"
            ngbTooltip="{{ 'HOME_ORDER_OPEN_TABLE' | tr }}"
          >
            <bi name="columns-gap" />
            {{ vm.order.table.group.name }} - {{ vm.order.table.number }}
          </a>

          <a
            routerLink="../../waiters/{{ vm.order.waiter.id }}"
            class="badge bg-primary d-flex align-items-center gap-2"
            ngbTooltip="{{ 'HOME_ORDER_OPEN_WAITER' | tr }}"
          >
            <bi name="people" />
            {{ vm.order.waiter.name }}
          </a>
        </scrollable-toolbar>

        <scrollable-toolbar>
          <back-button />
          <div>
            @if (vm.showRequeueButton) {
              <button class="btn btn-sm btn-warning" (click)="requeueOrder(vm.order.id)">
                <bi name="printer" />
                {{ 'HOME_ORDER_REQUEUE' | tr }}
              </button>
            }
          </div>
        </scrollable-toolbar>

        <hr />

        <app-order-products-list
          [orderProducts]="vm.order.orderProducts"
          (requeueOrdersOfPrinter)="requeueOrdersOfPrinter(vm.order.id, $event)"
          [showRequeueButton]="vm.showRequeueButton"
        />
      </div>
    }
  `,
  selector: 'app-orders-info',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    DatePipe,
    BiComponent,
    ScrollableToolbarComponent,
    AppBackButtonComponent,
    AppOrderStateBadgeComponent,
    AppOrderRefreshButtonComponent,
    AppOrderProductsListComponent,
    RouterLink,
    DfxTr,
    NgbTooltip,
    AppTestBadge,
    BiComponent,
  ],
})
export class OrderInfoComponent {
  confirmDialog = injectConfirmDialog();
  ordersService = inject(OrdersService);

  vm$ = combineLatest([injectIdParam$().pipe(switchMap((id) => this.ordersService.getSingle$(id))), this.ordersService.countdown$()]).pipe(
    map(([order, countdown]) => {
      const createdAt = new Date(order.createdAt);
      createdAt.setSeconds(createdAt.getSeconds() + 60);
      return {
        order,
        orderProductPrintStates: order.orderProducts.map((it) => it.printState),
        showRequeueButton: createdAt.getTime() < new Date().getTime(),
        countdown,
      };
    }),
  );

  requeueOrder(id: number): void {
    void this.confirmDialog('HOME_ORDER_REQUEUE').then((result) => {
      if (result) {
        this.ordersService.requeueOrder$(id).subscribe();
      }
    });
  }

  requeueOrdersOfPrinter(orderId: number, printerId: number): void {
    void this.confirmDialog('HOME_ORDER_REQUEUE').then((result) => {
      if (result) {
        this.ordersService.requeueOrderPrinter$(orderId, printerId).subscribe();
      }
    });
  }
}
