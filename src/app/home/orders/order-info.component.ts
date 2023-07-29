import {AsyncPipe, DatePipe, NgClass, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle, NgbModal, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {DfxTr} from 'dfx-translate';
import {combineLatest, map, switchMap} from 'rxjs';
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
    <ng-container *ngIf="vm$ | async as vm">
      <div class="d-flex flex-wrap justify-content-between gap-2 gap-md-0">
        <h1 class="mb-0">{{ 'HOME_ORDER' | tr }} #{{ vm.order.orderNumber }}</h1>
        <app-order-countdown [countdown]="vm.countdown" />
      </div>

      <div class="d-flex flex-wrap gap-2 mt-2 mb-4">
        <app-order-state-badge [orderState]="vm.order.state" [createdAt]="vm.order.createdAt" [processedAt]="vm.order.processedAt" />

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

  vm$ = combineLatest([
    getActivatedRouteIdParam().pipe(switchMap((id) => this.ordersService.getSingle$(id))),
    this.ordersService.countdown$(),
  ]).pipe(
    map(([order, countdown]) => {
      const createdAt = new Date(order.createdAt);
      createdAt.setSeconds(createdAt.getSeconds() + 60);
      return {
        order,
        showRequeueButton: createdAt.getTime() < new Date().getTime(),
        countdown,
      };
    }),
  );

  requeueOrder(id: number) {
    const modalRef = this.modal.open(QuestionDialogComponent, {ariaLabelledBy: 'modal-question-title', size: 'lg'});
    modalRef.componentInstance.title = 'HOME_ORDER_REQUEUE';

    void modalRef.result
      .then((result) => {
        if (result?.toString().includes(QuestionDialogComponent.YES_VALUE)) {
          this.ordersService.requeueOrder$(id).subscribe();
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
          this.ordersService.requeueOrderPrinter$(orderId, printerId).subscribe();
        }
      })
      .catch(() => {});
  }
}
