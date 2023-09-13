import {AsyncPipe, DatePipe, NgClass, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';

import {combineLatest, map, switchMap} from 'rxjs';

import {NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {a_pluck} from 'dfts-helper';
import {DfxArrayPluck} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';

import {getActivatedRouteIdParam} from '../../_shared/services/getActivatedRouteIdParam';
import {AppBackButtonComponent} from '../../_shared/ui/button/app-back-button.component';
import {AppBtnToolbarComponent} from '../../_shared/ui/button/app-btn-toolbar.component';
import {AppIconsModule} from '../../_shared/ui/icons.module';
import {injectConfirmDialog} from '../../_shared/ui/question-dialog/question-dialog.component';
import {AppOrderRefreshButtonComponent} from './_components/app-order-refresh-button.component';
import {AppOrderStateBadgeComponent} from './_components/app-order-state-badge.component';
import {AppOrderProductsListComponent} from './_components/order-products-list/app-order-products-list.component';
import {OrdersService} from './orders.service';

@Component({
  template: `
    <ng-container *ngIf="vm$ | async as vm">
      <div class="d-flex flex-wrap justify-content-between gap-2 gap-md-0">
        <h1 class="mb-0">{{ 'HOME_ORDER' | tr }} #{{ vm.order.orderNumber }}</h1>
        <app-order-refresh-btn [countdown]="vm.countdown" />
      </div>

      <div class="d-flex flex-wrap gap-2 mt-2 mb-4">
        <app-order-state-badge
          [orderState]="vm.order.state"
          [orderProductStates]="vm.orderProductStates"
          [createdAt]="vm.order.createdAt"
          [processedAt]="vm.order.processedAt"
        />

        <span
          class="badge bg-secondary d-flex align-items-center gap-2 ms-md-5 not-selectable"
          *ngIf="vm.order.state !== 'QUEUED'"
          ngbTooltip="Erstellt um"
        >
          <i-bs name="save" />
          {{ vm.order.createdAt | date: 'dd.MM. HH:mm:ss' }}
        </span>

        <a
          routerLink="/home/tables/{{ vm.order.table.id }}"
          class="badge bg-secondary d-flex align-items-center gap-2"
          ngbTooltip="{{ 'HOME_ORDER_OPEN_TABLE' | tr }}"
        >
          <i-bs name="columns-gap" />
          {{ vm.order.table.group.name }} - {{ vm.order.table.number }}
        </a>

        <a
          routerLink="/home/waiters/{{ vm.order.waiter.id }}"
          class="badge bg-primary d-flex align-items-center gap-2"
          ngbTooltip="{{ 'HOME_ORDER_OPEN_WAITER' | tr }}"
        >
          <i-bs name="people" />
          {{ vm.order.waiter.name }}
        </a>
      </div>

      <btn-toolbar padding="false">
        <back-button />
        <div>
          <button class="btn btn-sm btn-warning" (click)="requeueOrder(vm.order.id)" *ngIf="vm.showRequeueButton">
            <i-bs name="printer" />
            {{ 'HOME_ORDER_REQUEUE' | tr }}
          </button>
        </div>
      </btn-toolbar>

      <hr />

      <app-order-products-list
        [orderProducts]="vm.order.orderProducts"
        (requeueOrdersOfPrinter)="requeueOrdersOfPrinter(vm.order.id, $event)"
        [showRequeueButton]="vm.showRequeueButton"
      />
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
    AppOrderStateBadgeComponent,
    AppOrderRefreshButtonComponent,
    AppIconsModule,
    NgbDropdown,
    NgbDropdownMenu,
    NgbDropdownToggle,
    NgbDropdownItem,
    AppOrderProductsListComponent,
    NgClass,
    RouterLink,
    DfxTr,
    NgbTooltip,
    DfxArrayPluck,
  ],
})
export class OrderInfoComponent {
  confirmDialog = injectConfirmDialog();
  ordersService = inject(OrdersService);

  vm$ = combineLatest([
    getActivatedRouteIdParam().pipe(switchMap((id) => this.ordersService.getSingle$(id))),
    this.ordersService.countdown$(),
  ]).pipe(
    map(([order, countdown]) => {
      const createdAt = new Date(order.createdAt);
      createdAt.setSeconds(createdAt.getSeconds() + 60);
      return {
        order,
        orderProductStates: order.orderProducts.map((it) => it.printState),
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

  protected readonly a_pluck = a_pluck;
}
