import {AsyncPipe, DatePipe, NgClass, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle, NgbModal, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {DfxTr} from 'dfx-translate';
import {map, shareReplay, switchMap} from 'rxjs';
import {getActivatedRouteIdParam} from '../../_shared/services/getActivatedRouteIdParam';
import {AppBackButtonComponent} from '../../_shared/ui/app-back-button.component';
import {AppBtnToolbarComponent} from '../../_shared/ui/app-btn-toolbar.component';
import {AppIconsModule} from '../../_shared/ui/icons.module';
import {QuestionDialogComponent} from '../../_shared/ui/question-dialog/question-dialog.component';
import {AppOrderCountdownComponent} from './_components/app-order-countdown.component';
import {AppOrderStateBadgeComponent} from './_components/app-order-state-badge.component';
import {AppOrderProductsListComponent} from './_components/order-products-list/app-order-products-list.component';
import {OrdersService} from './orders.service';

@Component({
  template: `
    <ng-container *ngIf="order$ | async as order">
      <div class="d-flex flex-wrap justify-content-between gap-2 gap-md-0">
        <h1 class="mb-0">{{ 'HOME_ORDER' | tr }} #{{ order.orderNumber }}</h1>
        <app-order-countdown [countdown]="(countdown$ | async) ?? 0" />
      </div>

      <div class="d-flex flex-wrap gap-2 mt-2 mb-4">
        <app-order-state-badge [orderState]="order.state" [createdAt]="order.createdAt" [processedAt]="order.processedAt" />

        <span class="badge bg-secondary d-flex align-items-center gap-2 ms-md-5" *ngIf="order.state !== 'QUEUED'" ngbTooltip="Erstellt um">
          <i-bs name="save" />
          {{ order.createdAt | date : 'dd.MM. HH:mm:ss' }}
        </span>

        <a
          routerLink="/home/waiters/{{ order.waiter.id }}"
          class="badge bg-primary d-flex align-items-center gap-2"
          ngbTooltip="{{ 'HOME_ORDER_OPEN_WAITER' | tr }}"
        >
          <i-bs name="people" />
          {{ order.waiter.name }}
        </a>

        <a
          routerLink="/home/tables/{{ order.table.id }}"
          class="badge bg-secondary d-flex align-items-center gap-2"
          ngbTooltip="{{ 'HOME_ORDER_OPEN_TABLE' | tr }}"
        >
          <i-bs name="columns-gap" />
          {{ order.table.group.name }} - {{ order.table.number }}
        </a>
      </div>

      <btn-toolbar padding="false">
        <back-button />
        <div>
          <button class="btn btn-sm btn-warning" (click)="requeueOrder(order.id)" *ngIf="showRequeueButton$ | async">
            <i-bs name="printer" />
            {{ 'HOME_ORDER_REQUEUE' | tr }}
          </button>
        </div>
      </btn-toolbar>

      <hr />

      <app-order-products-list
        [orderProducts]="order.orderProducts"
        (requeueOrdersOfPrinter)="requeueOrdersOfPrinter(order.id, $event)"
        [showRequeueButton]="(showRequeueButton$ | async) ?? false"
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
    AppOrderCountdownComponent,
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
  ],
})
export class OrderInfoComponent {
  modal = inject(NgbModal);
  ordersService = inject(OrdersService);
  order$ = getActivatedRouteIdParam().pipe(
    switchMap((id) => this.ordersService.getSingle$(id)),
    shareReplay(1)
  );
  countdown$ = this.ordersService.countdown$();

  showRequeueButton$ = this.order$.pipe(
    map((it) => {
      const createdAt = new Date(it.createdAt);
      createdAt.setSeconds(createdAt.getSeconds() + 60);

      return createdAt.getTime() < new Date().getTime();
      // let hasOpenOrders = false;
      // for (const ops of it.orderProducts) {
      //   if (ops.printState !== "PRINTED") {
      //     hasOpenOrders = true;
      //   }
      // }
      //
      // if (createdAt.getTime() < new Date().getTime() && hasOpenOrders) {
      //   return true;
      // }
      // return false;
    }),
    shareReplay(1)
  );

  requeueOrder(id: number) {
    const modalRef = this.modal.open(QuestionDialogComponent, {ariaLabelledBy: 'modal-question-title', size: 'lg'});
    modalRef.componentInstance.title = 'HOME_ORDER_REQUEUE';

    void modalRef.result
      .then((result) => {
        if (result?.toString().includes(QuestionDialogComponent.YES_VALUE)) {
          this.ordersService.requeueOrder(id).subscribe();
        }
      })
      .catch(() => {});
  }

  requeueOrdersOfPrinter(orderId: number, printerId: number) {
    const modalRef = this.modal.open(QuestionDialogComponent, {ariaLabelledBy: 'modal-question-title', size: 'lg'});
    modalRef.componentInstance.title = 'HOME_ORDER_REQUEUE';

    void modalRef.result
      .then((result) => {
        if (result?.toString().includes(QuestionDialogComponent.YES_VALUE)) {
          this.ordersService.requeueOrderPrinter(orderId, printerId).subscribe();
        }
      })
      .catch(() => {});
  }
}
