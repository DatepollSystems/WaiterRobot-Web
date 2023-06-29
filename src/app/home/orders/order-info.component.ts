import {AsyncPipe, DatePipe, NgClass, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle, NgbModal} from '@ng-bootstrap/ng-bootstrap';
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
      <div class="d-flex flex-column flex-md-row justify-content-between gap-2 gap-md-0">
        <div class="d-flex flex-column flex-md-row gap-1 gap-md-4 align-items-start align-items-md-center">
          <div>
            <h1 class="mb-0">{{ 'HOME_ORDER' | tr }} #{{ order.orderNumber }}</h1>
          </div>
          <div>
            <app-order-state-badge [orderState]="order.state" />
          </div>
        </div>
        <app-order-countdown [countdown]="(countdown$ | async) ?? 0" />
      </div>
      <div class="d-flex gap-2 my-3 my-md-2">
        <span class="badge bg-secondary rounded-pill">Erstellt um: {{ order.createdAt | date : 'dd.MM. HH:mm:ss' }}</span>
        <span class="badge rounded-pill" [ngClass]="{'bg-secondary': !order.processedAt, 'bg-success': order.processedAt}"
          >Verarbeitet um:
          <span *ngIf="order.processedAt; else sentToPrinterUnknown">{{ order.processedAt | date : 'dd.MM. HH:mm:ss' }}</span>
          <ng-template #sentToPrinterUnknown>{{ 'UNKNOWN' | tr }}</ng-template></span
        >
      </div>
      <btn-toolbar>
        <back-button />
        <div>
          <a class="btn btn-sm btn-outline-primary" routerLink="/home/waiters/{{ order.waiter.id }}">
            <i-bs name="people" />
            {{ 'HOME_ORDER_OPEN_WAITER' | tr }} ({{ order.waiter.name }})
          </a>
        </div>
        <div class="btn-group">
          <a class="btn btn-outline-secondary btn-sm" routerLink="/home/tables/{{ order.table.id }}">
            <i-bs name="columns-gap" />
            {{ 'HOME_ORDER_OPEN_TABLE' | tr }} ({{ order.table.group.name }} - {{ order.table.number }})
          </a>
          <div class="btn-group" ngbDropdown role="group" aria-label="Button group with nested dropdown" container="body">
            <button type="button" class="btn btn-sm btn-outline-secondary dropdown-toggle" ngbDropdownToggle></button>
            <ul class="dropdown-menu" ngbDropdownMenu>
              <a ngbDropdownItem routerLink="/home/tables/groups/tables/{{ order.table.group.id }}">
                <i-bs name="diagram-3" />
                {{ 'HOME_ORDER_OPEN_TABLE_GROUP' | tr }}
              </a>
              <a ngbDropdownItem routerLink="/home/tables/groups/{{ order.table.group.id }}">
                <i-bs name="pencil-square" />
                {{ 'HOME_ORDER_EDIT_TABLE_GROUP' | tr }}</a
              >
            </ul>
          </div>
        </div>
        <div>
          <button class="btn btn-sm btn-warning" (click)="requeueOrder(order.id)" *ngIf="showRequeueButton$ | async">
            <i-bs name="printer" />
            {{ 'HOME_ORDER_REQUEUE' | tr }}
          </button>
        </div>
      </btn-toolbar>

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
